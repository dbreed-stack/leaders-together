import { getAuth, getUsers, findUserKey, rateLimit, sameOriginOnly } from './_lib.js';

export const config = { maxDuration: 60 };

const MODEL = 'claude-sonnet-4-5';
const RETRYABLE = new Set([429, 500, 502, 503, 504, 529]);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export default async function handler(req, res) {
  if (sameOriginOnly(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Only signed-in participants (or the admin) can use the AI.
  const auth = getAuth(req);
  if (!auth) return res.status(401).json({ error: 'Please sign in again.' });
  if (!auth.isAdmin) {
    const users = await getUsers();
    const key = findUserKey(users, auth.email);
    if (!key || users[key].suspended) return res.status(403).json({ error: 'Not allowed' });
  }
  // One assessment is ~11 calls; this leaves lots of room for retries but stops abuse.
  if (!(await rateLimit(`score:${auth.email}`, auth.isAdmin ? 300 : 60, 3600))) {
    return res.status(429).json({ error: 'Too many scoring requests. Please try again in an hour.' });
  }

  // Only allow the shape the app actually uses.
  const { system, messages, max_tokens } = req.body || {};
  const content = Array.isArray(messages) && messages.length === 1 && messages[0]?.role === 'user' ? messages[0].content : null;
  if (typeof content !== 'string' || content.length > 20000 || (system && (typeof system !== 'string' || system.length > 20000))) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const payload = {
    model: MODEL,
    max_tokens: Math.min(Math.max(parseInt(max_tokens, 10) || 1000, 100), 2000),
    ...(system ? { system } : {}),
    messages: [{ role: 'user', content }],
  };

  const started = Date.now();
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) return res.json(data);
      console.error(`Anthropic error (try ${attempt}, ${response.status}):`, JSON.stringify(data).slice(0, 500));
      // Retry busy/overloaded/rate-limited errors if there is still time before the 60s limit.
      if (RETRYABLE.has(response.status) && attempt < 3 && Date.now() - started < 25000) { await sleep(1500 * attempt); continue; }
      return res.status(response.status).json(data);
    } catch (e) {
      console.error(`Score handler exception (try ${attempt}):`, e.message);
      if (attempt < 3 && Date.now() - started < 25000) { await sleep(1500 * attempt); continue; }
      return res.status(502).json({ error: 'Could not reach the AI service.' });
    }
  }
}
