export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-app-secret');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.headers['x-app-secret'] !== process.env.APP_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body || {};
  const ok = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS;
  res.json({ ok });
}
