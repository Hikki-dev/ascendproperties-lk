import type { APIRoute } from 'astro';
import { one, run } from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';
import { int, saveFile, str } from '../../../lib/util';

// One endpoint for every after-sales write; `op` is matched against a fixed list.
export const POST: APIRoute = async ({ request, redirect }) => {
  const f = await request.formData();
  const op = str(f, 'op');
  let uid = int(f, 'user_id');
  const pid = int(f, 'purchase_id');
  const file = f.get('file');
  const upload = async () => (file instanceof File && file.size > 0 ? saveFile(file, 'priv', 15) : null);

  if (op === 'create_customer') {
    const email = str(f, 'email', 120).toLowerCase(), pw = str(f, 'password', 100);
    if (!email.includes('@') || pw.length < 8 || !str(f, 'name') || (await one('SELECT 1 x FROM users WHERE email=?', email))) return redirect('/admin/customers?err=1');
    const r = await run('INSERT INTO users (email,name,phone,password_hash,role) VALUES (?,?,?,?,?)', email, str(f, 'name', 100), str(f, 'phone', 30) || null, await hashPassword(pw), 'customer');
    return redirect(`/admin/customers/${r.meta.last_row_id}`);
  }
  if (op === 'reset_password' && uid && str(f, 'password', 100).length >= 8) {
    await run('UPDATE users SET password_hash=? WHERE id=? AND role=?', await hashPassword(str(f, 'password', 100)), uid, 'customer');
    await run('DELETE FROM sessions WHERE user_id=?', uid);
  } else if (op === 'add_purchase' && uid && int(f, 'total') && (await one("SELECT 1 x FROM users WHERE id=? AND role='customer'", uid))) {
    const lid = int(f, 'listing_id');
    await run('INSERT INTO purchases (user_id,listing_id,lot,total) VALUES (?,?,?,?)', uid, lid || null, str(f, 'lot', 40) || null, int(f, 'total'));
  } else if (op === 'update_purchase' && pid) {
    const stage = Math.min(4, Math.max(0, int(f, 'stage')));
    await run('UPDATE purchases SET stage=?, next_due_on=? WHERE id=?', stage, str(f, 'next_due_on', 10) || null, pid);
  } else if (op === 'add_payment' && pid && int(f, 'amount')) {
    await run('INSERT INTO payments (purchase_id,paid_on,description,amount,receipt) VALUES (?,?,?,?,?)',
      pid, str(f, 'paid_on', 10) || new Date().toISOString().slice(0, 10), str(f, 'description', 120) || 'Payment', int(f, 'amount'), await upload());
  } else if (op === 'delete_payment' && int(f, 'payment_id')) {
    await run('DELETE FROM payments WHERE id=? AND purchase_id=?', int(f, 'payment_id'), pid);
  } else if (op === 'add_document' && pid) {
    const key = await upload();
    if (key) await run('INSERT INTO documents (purchase_id,name,file) VALUES (?,?,?)', pid, str(f, 'name', 120) || 'Document', key);
  } else if (op === 'delete_document' && int(f, 'document_id')) {
    await run('DELETE FROM documents WHERE id=? AND purchase_id=?', int(f, 'document_id'), pid);
  }
  if (!uid && pid) uid = (await one<{ user_id: number }>('SELECT user_id FROM purchases WHERE id=?', pid))?.user_id ?? 0;
  return redirect(uid ? `/admin/customers/${uid}` : '/admin/customers');
};
