import type { APIRoute } from 'astro';
import { createDraft } from '../../../lib/drafts';
import { str } from '../../../lib/util';

// Creates hidden drafts from pasted WhatsApp messages. Staff review each draft before it goes live.
export const POST: APIRoute = async ({ request, redirect }) => {
  const f = await request.formData();
  const posts = str(f, 'text', 20000).split(/\n\s*-{3,}\s*\n/).map((t) => t.trim()).filter((t) => t.length > 5).slice(0, 25);
  if (!posts.length) return redirect('/admin/import?err=1');
  const ids: number[] = [];
  for (const t of posts) ids.push(await createDraft(t));
  return redirect(ids.length === 1 ? `/admin/listings/${ids[0]}?imported=1` : '/admin/listings');
};
