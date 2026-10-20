import { all, one, run, secrets } from './db';

const enc = new TextEncoder();
const b64 = (b: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(b)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

// Workers cap PBKDF2 at 100k iterations.
const derive = async (pw: string, salt: Uint8Array) => {
  const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 }, key, 256);
};

export async function hashPassword(pw: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `${b64(salt)}$${b64(await derive(pw, salt))}`;
}

export async function verifyPassword(pw: string, stored: string) {
  const [s, h] = stored.split('$');
  if (!s || !h) return false;
  const got = new Uint8Array(await derive(pw, unb64(s)));
  const want = unb64(h);
  let diff = got.length ^ want.length;
  for (let i = 0; i < got.length; i++) diff |= got[i] ^ (want[i] ?? 0);
  return diff === 0;
}

export type User = { id: number; email: string; name: string; role: 'admin' | 'customer' };

export async function login(email: string, password: string) {
  email = email.trim().toLowerCase();
  let u = await one<any>('SELECT * FROM users WHERE email = ?', email);
  // First admin is bootstrapped from secrets ADMIN_EMAIL / ADMIN_PASSWORD, only while no admin exists.
  if (!u) {
    const s = secrets();
    const hasAdmin = await one('SELECT 1 AS x FROM users WHERE role = ?', 'admin');
    if (!hasAdmin && s.ADMIN_EMAIL?.toLowerCase() === email && s.ADMIN_PASSWORD === password) {
      await run('INSERT INTO users (email,name,password_hash,role) VALUES (?,?,?,?)', email, 'Admin', await hashPassword(password), 'admin');
      u = await one<any>('SELECT * FROM users WHERE email = ?', email);
    }
  }
  if (!u || !(await verifyPassword(password, u.password_hash))) return null;
  const token = b64(crypto.getRandomValues(new Uint8Array(32))).replace(/[+/=]/g, '');
  await run('INSERT INTO sessions (token,user_id,expires_at) VALUES (?,?,datetime(\'now\',\'+14 days\'))', token, u.id);
  return { token, user: u as User };
}

export async function userFromToken(token?: string): Promise<User | null> {
  if (!token) return null;
  return (await one<User>(
    `SELECT u.id,u.email,u.name,u.role FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > datetime('now')`, token)) ?? null;
}

export const logout = (token: string) => run('DELETE FROM sessions WHERE token = ?', token);
export const purgeExpired = () => run("DELETE FROM sessions WHERE expires_at < datetime('now')");
export { all };
