import {
  getUsers, saveUsers, findUserKey, publicUser, hashPassword, verifyPassword,
  migratePasswords, checkAdminLogin, signToken, getAuth, rateLimit, clientIp,
  sameOriginOnly, redis, COHORT_CODES, ADMIN_EMAIL,
} from './_lib.js';

const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const clean = (s, max = 200) => String(s ?? '').trim().slice(0, max);

export default async function handler(req, res) {
  if (sameOriginOnly(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = req.body || {};
  const action = body.action;

  try {
    // ── Restore session ────────────────────────────────────────────────────
    if (action === 'me') {
      const auth = getAuth(req);
      if (!auth) return res.status(401).json({ error: 'Not signed in' });
      if (auth.isAdmin) return res.json({ isAdmin: true, user: { name: 'Admin', email: ADMIN_EMAIL } });
      const users = await getUsers();
      const key = findUserKey(users, auth.email);
      if (!key) return res.status(401).json({ error: 'Account not found' });
      return res.json({ isAdmin: false, user: publicUser(users[key]) });
    }

    // ── Login (admin or participant) ───────────────────────────────────────
    if (action === 'login') {
      if (!(await rateLimit(`login:${clientIp(req)}`, 20, 900))) {
        return res.status(429).json({ error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' });
      }
      const email = clean(body.email);
      const password = String(body.password || '');
      if (checkAdminLogin(email, password)) {
        const users = await getUsers();
        if (migratePasswords(users)) await saveUsers(users);
        return res.json({ token: signToken(ADMIN_EMAIL, true), isAdmin: true, user: { name: 'Admin', email: ADMIN_EMAIL } });
      }
      const users = await getUsers();
      const key = findUserKey(users, email);
      const ok = key && verifyPassword(password, users[key].password);
      // Upgrade any remaining plaintext passwords while we have the user list loaded.
      const migrated = migratePasswords(users);
      if (migrated) await saveUsers(users);
      if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });
      return res.json({ token: signToken(key, false), isAdmin: false, user: publicUser(users[key]) });
    }

    // ── Sign up ────────────────────────────────────────────────────────────
    if (action === 'signup') {
      if (!(await rateLimit(`signup:${clientIp(req)}`, 10, 3600))) {
        return res.status(429).json({ error: 'Too many sign-ups from this network. Please try again later.' });
      }
      const name = clean(body.name, 100), email = clean(body.email, 200).toLowerCase();
      const password = String(body.password || ''), industry = clean(body.industry, 100), role = clean(body.role, 100);
      const code = clean(body.code, 40).toUpperCase();
      if (!name || !email || !password || !industry || !role) return res.status(400).json({ error: 'All fields are required.' });
      if (!isEmail(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
      if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      if (email === ADMIN_EMAIL) return res.status(400).json({ error: 'An account with this email already exists.' });

      const users = await getUsers();
      if (findUserKey(users, email)) return res.status(409).json({ error: 'An account with this email already exists.' });

      let tier = 'trial', isSupervisor = false;
      if (code) {
        const codes = (await redis.get('supCodes')) || {};
        if (codes[code] && !codes[code].used) {
          tier = 'cohort'; isSupervisor = true;
          codes[code].used = true; codes[code].usedBy = email;
          await redis.set('supCodes', codes);
        } else if (COHORT_CODES.includes(code)) {
          tier = 'cohort';
        }
      }
      const u = { name, email, password: hashPassword(password), tier, isSupervisor, industry, role,
        cohortCode: code || null, createdAt: Date.now(), suspended: false, cohort: false };
      users[email] = u;
      migratePasswords(users);
      await saveUsers(users);
      return res.json({ token: signToken(email, false), isAdmin: false, user: publicUser(u) });
    }

    // ── Update own profile / password ──────────────────────────────────────
    if (action === 'updateProfile') {
      const auth = getAuth(req);
      if (!auth || auth.isAdmin) return res.status(401).json({ error: 'Not signed in' });
      const users = await getUsers();
      const key = findUserKey(users, auth.email);
      if (!key) return res.status(401).json({ error: 'Account not found' });
      const industry = clean(body.industry, 100), role = clean(body.role, 100);
      if (!industry || !role) return res.status(400).json({ error: 'Both fields are required.' });
      if (body.newPassword) {
        if (String(body.newPassword).length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters.' });
        if (!verifyPassword(String(body.currentPassword || ''), users[key].password)) return res.status(400).json({ error: 'Current password is incorrect.' });
        users[key].password = hashPassword(String(body.newPassword));
      }
      users[key].industry = industry;
      users[key].role = role;
      await saveUsers(users);
      return res.json({ user: publicUser(users[key]) });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (e) {
    console.error('auth error:', action, e.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
