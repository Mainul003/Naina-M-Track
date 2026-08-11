import crypto from 'node:crypto';

const COOKIE_NAME = 'naina_session';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing server setting: ${name}`);
  return value;
}

function signature(value) {
  return crypto.createHmac('sha256', required('SESSION_SECRET')).update(value).digest('base64url');
}

export function createSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 7 * 86400000 })).toString('base64url');
  return `${payload}.${signature(payload)}`;
}

export function isAuthorized(req) {
  const cookies = Object.fromEntries((req.headers.cookie || '').split(';').map(x => x.trim().split('=')));
  const token = cookies[COOKIE_NAME];
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = signature(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url')).exp > Date.now(); } catch { return false; }
}

export function sessionCookie(token) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`;
}

export function clearCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function passwordMatches(user, password) {
  const expectedUser = process.env.APP_USER_ID || 'Naina03';
  const expectedHash = required('APP_PASSWORD_HASH');
  const actualHash = crypto.createHash('sha256').update(password).digest('hex');
  return user === expectedUser && actualHash.length === expectedHash.length && crypto.timingSafeEqual(Buffer.from(actualHash), Buffer.from(expectedHash));
}

export async function githubFile() {
  const owner = required('GH_OWNER'), repo = required('GH_REPO'), branch = process.env.GH_BRANCH || 'main';
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/records.json?ref=${encodeURIComponent(branch)}`, {
    headers: { Authorization: `Bearer ${required('GH_TOKEN')}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'naina-money-tracker' }
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub read failed (${response.status})`);
  return response.json();
}

export async function commitData(records, sha) {
  const owner = required('GH_OWNER'), repo = required('GH_REPO');
  const body = { message: `Update money records - ${new Date().toISOString()}`, content: Buffer.from(JSON.stringify(records, null, 2)).toString('base64'), branch: process.env.GH_BRANCH || 'main' };
  if (sha) body.sha = sha;
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/records.json`, {
    method: 'PUT', headers: { Authorization: `Bearer ${required('GH_TOKEN')}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'naina-money-tracker' }, body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`GitHub commit failed (${response.status}): ${await response.text()}`);
  return response.json();
}
