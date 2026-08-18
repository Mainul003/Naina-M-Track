import { commitData, githubFile, sessionUser } from './_shared.js';

export default async function handler(req, res) {
  const user = sessionUser(req);
  if (!user) return res.status(401).json({ error: 'Please sign in.' });
  try {
    if (user === 'morsheda') {
      if (req.method !== 'GET') return res.status(403).json({ error: 'Morsheda records are read-only to keep them private.' });
      const data = process.env.MORSHEDA_RECORDS_JSON;
      if (!data) return res.status(500).json({ error: 'Morsheda records have not been configured yet.' });
      return res.status(200).json({ data: JSON.parse(data), profile: { name: 'Morsheda Begum', editable: false } });
    }
    if (req.method === 'GET') {
      const file = await githubFile();
      if (!file) return res.status(200).json({ data: null, profile: { name: 'Naina', editable: true } });
      return res.status(200).json({ data: JSON.parse(Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf8')), profile: { name: 'Naina', editable: true } });
    }
    if (req.method === 'POST') {
      if (!req.body?.transactions || !req.body?.loanAccounts) return res.status(400).json({ error: 'Invalid records.' });
      let file = await githubFile();
      try { await commitData(req.body, file?.sha); }
      catch (error) {
        if (!String(error.message).includes('(409)')) throw error;
        file = await githubFile();
        await commitData(req.body, file?.sha);
      }
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not synchronize with GitHub.' });
  }
}
