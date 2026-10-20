import type { APIRoute } from 'astro';
import { one, run } from '../../../lib/db';
import { FACILITIES, int, lines, lots, saveFile, slugify, str, video } from '../../../lib/util';

const KEY = /^pub\/[\w.\-]+$/;

export const POST: APIRoute = async ({ request, redirect, url }) => {
  const f = await request.formData();
  const id = int(f, 'id');

  if (url.searchParams.get('delete')) {
    if (id) await run('DELETE FROM listings WHERE id = ?', id);
    return redirect('/admin/listings');
  }

  const title = str(f, 'title', 140), district = str(f, 'district', 40), price = int(f, 'price');
  if (!title || !district || !price) return redirect(id ? `/admin/listings/${id}?err=1` : '/admin/listings/new?err=1');

  let photos: string[] = [];
  try { photos = (JSON.parse(String(f.get('photos') ?? '[]')) as unknown[]).map(String).filter((k) => KEY.test(k)); } catch { /* ignore */ }
  const facilities = f.getAll('facilities').map(String).filter((x) => FACILITIES.includes(x));

  let brochure = str(f, 'brochure_keep', 80);
  if (!KEY.test(brochure)) brochure = '';
  const pdf = f.get('brochure');
  if (pdf instanceof File && pdf.size > 0) brochure = (await saveFile(pdf, 'pub', 15)) ?? brochure;

  const type = ['land', 'house', 'apartment'].includes(str(f, 'type')) ? str(f, 'type') : 'land';
  const status = ['draft', 'available', 'sold'].includes(str(f, 'status')) ? str(f, 'status') : 'draft';
  const pub = str(f, 'published_at', 10);
  const cols = [type, str(f, 'category', 60) || null, title, district, str(f, 'city', 80) || null, price, str(f, 'price_label', 40) || null,
    str(f, 'description', 5000) || null, JSON.stringify(facilities), int(f, 'down_payment_pct') || null, int(f, 'months') || null,
    str(f, 'map_url', 800) || null, photos[0] ?? null, JSON.stringify(photos.slice(1)), brochure || null, status, f.get('featured') ? 1 : 0, str(f, 'extent', 60) || null, str(f, 'nearby', 80) || null,
    video(str(f, 'video_url', 300)) ? str(f, 'video_url', 300) : null, JSON.stringify(lines(str(f, 'highlights', 900), 6)), JSON.stringify(lines(str(f, 'places', 900), 10, 80)), JSON.stringify(lots(String(f.get('lots') ?? '[]')))];

  if (id) {
    await run(`UPDATE listings SET type=?,category=?,title=?,district=?,city=?,price=?,price_label=?,description=?,facilities=?,down_payment_pct=?,months=?,map_url=?,cover=?,images=?,brochure=?,status=?,featured=?,extent=?,nearby=?,video_url=?,highlights=?,places=?,lots=?,
      published_at=COALESCE(?, published_at, CASE WHEN ?='available' THEN datetime('now') END), updated_at=datetime('now') WHERE id=?`, ...cols, pub || null, status, id);
    return redirect(`/admin/listings/${id}?saved=1`);
  }
  let slug = slugify(title);
  if (await one('SELECT 1 x FROM listings WHERE slug=?', slug)) slug += '-' + crypto.randomUUID().slice(0, 4);
  const r = await run(`INSERT INTO listings (slug,type,category,title,district,city,price,price_label,description,facilities,down_payment_pct,months,map_url,cover,images,brochure,status,featured,extent,nearby,video_url,highlights,places,lots,published_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, COALESCE(?, CASE WHEN ?='available' THEN datetime('now') END))`, slug, ...cols, pub || null, status);
  return redirect(`/admin/listings/${r.meta.last_row_id}?saved=1`);
};
