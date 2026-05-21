import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') {
    const val = await kv.get(req.query.key);
    return res.json(val ?? null);
  }
  if (req.method === 'POST') {
    const { key, val } = req.body;
    await kv.set(key, val);
    return res.status(200).end();
  }
  if (req.method === 'DELETE') {
    await kv.del(req.query.key);
    return res.status(200).end();
  }
  res.status(405).end();
}