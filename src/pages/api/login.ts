import type { APIRoute } from 'astro';
import { login } from '../../lib/auth';
import { str } from '../../lib/util';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const f = await request.formData();
  const r = await login(str(f, 'email', 120), str(f, 'password', 200));
  if (!r) return redirect('/login?err=1');
  cookies.set('sid', r.token, { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 14 * 86400 });
  const next = str(f, 'next', 200);
  return redirect(/^\/(admin|portal)[a-z0-9\-/]*$/i.test(next) ? next : r.user.role === 'admin' ? '/admin' : '/portal');
};
