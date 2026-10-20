import type { APIRoute } from 'astro';
import { run } from '../../../lib/db';
import { int, str } from '../../../lib/util';

export const POST: APIRoute = async ({ request, redirect }) => {
  const f = await request.formData();
  const id = int(f, 'ticket_id'), body = str(f, 'body', 3000);
  if (id && body) await run('INSERT INTO ticket_messages (ticket_id,author_role,body) VALUES (?,?,?)', id, 'admin', body);
  return redirect(id ? `/admin/tickets/${id}` : '/admin/tickets');
};
