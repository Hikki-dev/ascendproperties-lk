import type { APIRoute } from 'astro';
import { logout } from '../../lib/auth';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const t = cookies.get('sid')?.value;
  if (t) await logout(t);
  cookies.delete('sid', { path: '/' });
  return redirect('/login');
};
