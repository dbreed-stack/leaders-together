import {
  getUsers, saveUsers, findUserKey, publicUser, hashPassword, getAuth,
  sameOriginOnly, redis, ADMIN_EMAIL,
} from './_lib.js';
import crypto from 'node:crypto';

const MAX_ATTEMPT_BYTES = 200_000;

function genCode(len = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: len }, () => chars[crypto.randomInt(chars.length)]).join('');
}

export default async function handler(req, res) {
  if (sameOriginOnly(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const auth = getAuth(req);
  if (!auth) return res.status(401).json({ error: 'Please sign in again.' });
  const body = req.body || {};
  const action = body.action;

  try {
    // ════════ Participant actions ════════
    if (!auth.isAdmin) {
      const users = await getUsers();
      const key = findUserKey(users, auth.email);
      if (!key) return res.status(401).json({ error: 'Account not found' });
      const me = users[key];

      if (action === 'myData') {
        const attempts = (await redis.get(`attempts:${key}`)) || [];
        const supAttempts = me.isSupervisor ? ((await redis.get(`supAttempts:${key}`)) || {}) : {};
        return res.json({ user: publicUser(me), attempts, supAttempts });
      }

      if (action === 'saveAttempt') {
        if (me.suspended) return res.status(403).json({ error: 'Your account is suspended.' });
        const attempt = body.attempt;
        if (!attempt || typeof attempt !== 'object' || !Array.isArray(attempt.categoryScores)) {
          return res.status(400).json({ error: 'Invalid assessment data.' });
        }
        if (JSON.stringify(attempt).length > MAX_ATTEMPT_BYTES) return res.status(413).json({ error: 'Assessment too large.' });

        if (body.mode === 'supervisor') {
          if (!me.isSupervisor) return res.status(403).json({ error: 'Supervisor access required.' });
          const empEmail = String(body.empEmail || '').trim().slice(0, 200);
          if (!empEmail) return res.status(400).json({ error: 'Employee email required.' });
          const sa = (await redis.get(`supAttempts:${key}`)) || {};
          if (!sa[empEmail]) sa[empEmail] = [];
          sa[empEmail].push(attempt);
          await redis.set(`supAttempts:${key}`, sa);
          return res.json({ supAttempts: sa });
        }
        const existing = (await redis.get(`attempts:${key}`)) || [];
        if (me.tier === 'trial' && existing.length >= 1) return res.status(403).json({ error: 'Free trial is limited to one assessment.' });
        existing.push(attempt);
        await redis.set(`attempts:${key}`, existing);
        return res.json({ attempts: existing });
      }

      return res.status(403).json({ error: 'Not allowed' });
    }

    // ════════ Admin actions ════════
    if (action === 'adminData') {
      const users = await getUsers();
      const list = Object.values(users).filter(u => u && u.email !== ADMIN_EMAIL);
      const enriched = await Promise.all(list.map(async u => {
        const attempts = (await redis.get(`attempts:${u.email}`)) || [];
        const supAttempts = u.isSupervisor ? ((await redis.get(`supAttempts:${u.email}`)) || {}) : null;
        return { ...publicUser(u), attempts, supAttempts };
      }));
      const codes = (await redis.get('supCodes')) || {};
      return res.json({ users: enriched, codes });
    }

    if (action === 'genSupCode') {
      const codes = (await redis.get('supCodes')) || {};
      let c = genCode();
      while (codes[c]) c = genCode();
      codes[c] = { created: Date.now(), used: false, usedBy: null };
      await redis.set('supCodes', codes);
      return res.json({ codes });
    }

    if (['toggleSuspend', 'toggleCohort', 'deleteUser', 'resetPassword', 'updateSummary'].includes(action)) {
      const users = await getUsers();
      const key = findUserKey(users, body.email);
      if (!key) return res.status(404).json({ error: 'User not found.' });

      if (action === 'toggleSuspend') { users[key].suspended = !users[key].suspended; await saveUsers(users); return res.json({ ok: true }); }
      if (action === 'toggleCohort') { users[key].cohort = !users[key].cohort; await saveUsers(users); return res.json({ ok: true }); }
      if (action === 'resetPassword') {
        const pw = String(body.password || '');
        if (pw.length < 6) return res.status(400).json({ error: 'Min 6 characters.' });
        users[key].password = hashPassword(pw);
        await saveUsers(users);
        return res.json({ ok: true });
      }
      if (action === 'deleteUser') {
        const wasSup = users[key].isSupervisor;
        delete users[key];
        await saveUsers(users);
        await redis.del(`attempts:${key}`);
        if (wasSup) await redis.del(`supAttempts:${key}`);
        return res.json({ ok: true });
      }
      if (action === 'updateSummary') {
        const s = body.summary;
        if (!s || typeof s.narrative !== 'string' || !Array.isArray(s.strengths) || !Array.isArray(s.growth)) {
          return res.status(400).json({ error: 'Invalid summary.' });
        }
        const attempts = (await redis.get(`attempts:${key}`)) || [];
        const idx = attempts.findIndex(a => a.timestamp === body.timestamp);
        if (idx === -1) return res.status(404).json({ error: 'Assessment not found.' });
        attempts[idx].summary = { narrative: s.narrative, strengths: s.strengths.slice(0, 3), growth: s.growth.slice(0, 3), regeneratedAt: Date.now() };
        await redis.set(`attempts:${key}`, attempts);
        return res.json({ attempts });
      }
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (e) {
    console.error('data error:', action, e.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
