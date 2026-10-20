import type { APIRoute } from 'astro';
import { one, run } from '../../lib/db';
import { int, str } from '../../lib/util';

// Customer-only: open a ticket or reply to one of their own tickets.
export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user || user.role !== 'customer') return redirect('/login');
  const f = await request.formData();
  const body = str(f, 'body', 3000);
  if (!body) return redirect('/portal?err=1');
  const tid = int(f, 'ticket_id');
  if (tid) {
    const t = await one('SELECT id FROM tickets WHERE id=? AND user_id=?', tid, user.id);
    if (!t) return redirect('/portal');
    await run('INSERT INTO ticket_messages (ticket_id,author_role,body) VALUES (?,?,?)', tid, 'customer', body);
    await run("UPDATE tickets SET status='open' WHERE id=?", tid);
    return redirect(`/portal/tickets/${tid}`);
  }
  const pid = int(f, 'purchase_id');
  const ownPurchase = pid && (await one('SELECT id FROM purchases WHERE id=? AND user_id=?', pid, user.id));
  const r = await run('INSERT INTO tickets (user_id,purchase_id,subject) VALUES (?,?,?)', user.id, ownPurchase ? pid : null, str(f, 'subject', 120) || 'Support request');
  await run('INSERT INTO ticket_messages (ticket_id,author_role,body) VALUES (?,?,?)', r.meta.last_row_id, 'customer', body);
  return redirect(`/portal/tickets/${r.meta.last_row_id}`);
};
