// Shared server-side helpers. Files starting with "_" in /api are NOT deployed as endpoints.
import { Redis } from '@upstash/redis';
import crypto from 'node:crypto';

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@waymarklc.com').trim().toLowerCase();
export const COHORT_CODES = (process.env.COHORT_CODES || 'LEADERS2025,TRIANGLE25,COHORT1')
  .split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

const SESSION_HOURS = 24;

// ─── Signing key for session tokens ─────────────────────────────────────────
// Uses SESSION_SECRET if set in Vercel. Otherwise derives a key from server-only
// secrets that are never sent to the browser, so the app works without new config.
function signingKey() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  const base = (process.env.KV_REST_API_TOKEN || '') + '|' + (process.env.ANTHROPIC_API_KEY || '');
  if (base.length < 20) throw new Error('Server is missing SESSION_SECRET');
  return crypto.createHash('sha256').update('lt-session-v1|' + base).digest('hex');
}

const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
const fromB64url = (s) => Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function signToken(email, isAdmin) {
  const payload = b64url(JSON.stringify({ e: email, a: !!isAdmin, exp: Date.now() + SESSION_HOURS * 3600 * 1000 }));
  const sig = b64url(crypto.createHmac('sha256', signingKey()).update(payload).digest());
  return `${payload}.${sig}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const expected = b64url(crypto.createHmac('sha256', signingKey()).update(payload).digest());
  if (!safeEqual(sig, expected)) return null;
  try {
    const data = JSON.parse(fromB64url(payload).toString('utf8'));
    if (!data.exp || data.exp < Date.now()) return null;
    return { email: data.e, isAdmin: !!data.a };
  } catch { return null; }
}

export function getAuth(req) {
  const h = req.headers['authorization'] || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  return verifyToken(token);
}

// ─── Passwords (scrypt) ──────────────────────────────────────────────────────
export function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(pw), salt, 64);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export function isHashed(stored) { return typeof stored === 'string' && stored.startsWith('scrypt$'); }

export function verifyPassword(pw, stored) {
  if (!stored) return false;
  if (!isHashed(stored)) return safeEqual(String(pw), String(stored)); // legacy plaintext
  const [, saltB64, hashB64] = stored.split('$');
  const expected = Buffer.from(hashB64, 'base64');
  const actual = crypto.scryptSync(String(pw), Buffer.from(saltB64, 'base64'), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

export function checkAdminLogin(email, pw) {
  if (!process.env.ADMIN_PASS) return false;
  return safeEqual(String(email || '').trim().toLowerCase(), ADMIN_EMAIL) && safeEqual(String(pw || ''), process.env.ADMIN_PASS);
}

// Hash any legacy plaintext passwords in place. Returns true if anything changed.
export function migratePasswords(users) {
  let changed = false;
  for (const u of Object.values(users || {})) {
    if (u && u.password && !isHashed(u.password)) { u.password = hashPassword(u.password); changed = true; }
  }
  return changed;
}

// ─── Users ───────────────────────────────────────────────────────────────────
export async function getUsers() { return (await redis.get('users')) || {}; }
export async function saveUsers(users) { await redis.set('users', users); }

// Exact key first, then case-insensitive match (older accounts kept original casing).
export function findUserKey(users, email) {
  if (!email) return null;
  const e = String(email).trim();
  if (users[e]) return e;
  const lower = e.toLowerCase();
  return Object.keys(users).find(k => k.toLowerCase() === lower) || null;
}

export function publicUser(u) {
  if (!u) return null;
  const { password, ...rest } = u; // never send password hashes to the browser
  return rest;
}

// ─── Small helpers ───────────────────────────────────────────────────────────
export function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

// Fixed-window rate limit. Returns true if the call is allowed.
export async function rateLimit(key, limit, windowSec) {
  try {
    const k = `rl:${key}:${Math.floor(Date.now() / 1000 / windowSec)}`;
    const n = await redis.incr(k);
    if (n === 1) await redis.expire(k, windowSec + 5);
    return n <= limit;
  } catch { return true; } // never lock people out because the limiter failed
}

export function sameOriginOnly(req, res) {
  // No CORS headers are sent, so other websites cannot call these endpoints from a browser.
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  return false;
}
