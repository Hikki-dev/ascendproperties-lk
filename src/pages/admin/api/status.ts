import type { APIRoute } from 'astro';
import { run } from '../../../lib/db';
import { int, str } from '../../../lib/util';

// Whitelisted table/status pairs only; never interpolate user input into SQL.
const TABLES = { inquiries: ['new', 'contacted', 'closed'], seller_leads: ['new', 'contacted', 'closed'], tickets: ['open', 'closed'] } as const;

export const POST: APIRoute = async ({ request, redirect }) => {
  const f = await request.formData();
  const t = str(f, 't') as keyof typeof TABLES, s = str(f, 'status'), id = int(f, 'id');
  if (TABLES[t]?.includes(s as never) && id) await run(`UPDATE ${t} SET status = ? WHERE id = ?`, s, id);
  const back = str(f, 'back', 80);
  return redirect(/^\/admin\/[a-z0-9\-/]*$/.test(back) ? back : '/admin');
};
