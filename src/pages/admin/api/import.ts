import type { APIRoute } from 'astro';
import { one, run } from '../../../lib/db';
import { parseListing } from '../../../lib/parse';
import { DISTRICTS, slugify, str } from '../../../lib/util';

// Creates hidden drafts from pasted WhatsApp messages. Staff review each draft before it goes live.
export const POST: APIRoute = async ({ request, redirect }) => {
  const f = await request.formData();
  const posts = str(f, 'text', 20000).split(/\n\s*-{3,}\s*\n/).map((t) => t.trim()).filter((t) => t.length > 5).slice(0, 25);
  if (!posts.length) return redirect('/admin/import?err=1');
  const ids: number[] = [];
  for (const t of posts) {
    const p = parseListing(t, DISTRICTS);
    let slug = slugify(p.title);
    if (await one('SELECT 1 x FROM listings WHERE slug=?', slug)) slug += '-' + crypto.randomUUID().slice(0, 4);
    const r = await run(`INSERT INTO listings (slug,type,title,district,city,price,price_label,description,facilities,extent,status) VALUES (?,?,?,?,?,?,?,?,?,?, 'draft')`,
      slug, p.type, p.title, p.district, p.city || null, p.price, p.price_label, p.description, JSON.stringify(p.facilities), p.extent || null);
    ids.push(r.meta.last_row_id as number);
  }
  return redirect(ids.length === 1 ? `/admin/listings/${ids[0]}?imported=1` : '/admin/listings');
};
