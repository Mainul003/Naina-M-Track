import { createSession, passwordMatches, sessionCookie } from './_shared.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { user = '', password = '' } = req.body || {};
  if (!passwordMatches(user, password)) return res.status(401).json({ error: 'The user ID or password is incorrect.' });
  res.setHeader('Set-Cookie', sessionCookie(createSession()));
  return res.status(200).json({ ok: true });
}
