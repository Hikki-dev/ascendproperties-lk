import type { APIRoute } from 'astro';
import { hashPassword, verifyPassword } from '../../../lib/auth';
import { one, run } from '../../../lib/db';
import { str } from '../../../lib/util';

export const POST: APIRoute = async ({ request, locals, cookies, redirect }) => {
  const f = await request.formData(), me = locals.user!;
  const next = str(f, 'next', 200);
  const row = await one<{ password_hash: string }>('SELECT password_hash FROM users WHERE id=?', me.id);
  if (!row || !(await verifyPassword(str(f, 'current', 200), row.password_hash))) return redirect('/admin/account?err=wrong');
  if (next.length < 10) return redirect('/admin/account?err=short');
  if (next !== str(f, 'again', 200)) return redirect('/admin/account?err=same');
  await run('UPDATE users SET password_hash=? WHERE id=?', await hashPassword(next), me.id);
  // sign out every other device, keep this session
  await run('DELETE FROM sessions WHERE user_id=? AND token<>?', me.id, cookies.get('sid')?.value ?? '');
  return redirect('/admin/account?ok=1');
};
