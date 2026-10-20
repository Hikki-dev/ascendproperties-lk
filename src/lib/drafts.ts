import { one, run } from './db';
import { parseListing } from './parse';
import { DISTRICTS, slugify } from './util';

/** Creates a hidden draft from a pasted/exported WhatsApp message (+ photo keys already uploaded). Returns the new id. */
export async function createDraft(text: string, photos: string[] = []) {
  const p = parseListing(text, DISTRICTS);
  const keys = photos.filter((k) => /^pub\/[\w.\-]+$/.test(k)).slice(0, 12);
  let slug = slugify(p.title);
  if (await one('SELECT 1 x FROM listings WHERE slug=?', slug)) slug += '-' + crypto.randomUUID().slice(0, 4);
  const r = await run(`INSERT INTO listings (slug,type,title,district,city,price,price_label,description,facilities,extent,cover,images,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 'draft')`,
    slug, p.type, p.title, p.district, p.city || null, p.price, p.price_label, p.description, JSON.stringify(p.facilities), p.extent || null, keys[0] ?? null, JSON.stringify(keys.slice(1)));
  return r.meta.last_row_id as number;
}
