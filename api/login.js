import { createSession, profileForCredentials, sessionCookie } from './_shared.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { user = '', password = '' } = req.body || {};
  const profile = profileForCredentials(user, password);
  if (!profile) return res.status(401).json({ error: 'The user ID or password is incorrect.' });
  res.setHeader('Set-Cookie', sessionCookie(createSession(profile.id)));
  return res.status(200).json({ ok: true, name: profile.name });
}
