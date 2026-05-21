import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') {
    const val = await redis.get(req.query.key);
    return res.json(val ?? null);
  }
  if (req.method === 'POST') {
    const { key, val } = req.body;
    await redis.set(key, val);
    return res.status(200).end();
  }
  if (req.method === 'DELETE') {
    await redis.del(req.query.key);
    return res.status(200).end();
  }
  res.status(405).end();
}