import type { APIRoute } from 'astro';
import { run } from '../../../lib/db';
import { int, safeUrl, str, video } from '../../../lib/util';

export const POST: APIRoute = async ({ request, redirect }) => {
  const f = await request.formData();
  const op = str(f, 'op'), id = int(f, 'id');
  if (op === 'toggle' && id) await run('UPDATE banners SET active = 1 - active WHERE id = ?', id);
  else if (op === 'delete' && id) await run('DELETE FROM banners WHERE id = ?', id);
  else if (op === 'create' && str(f, 'title')) {
    let img: string[] = [];
    try { img = JSON.parse(String(f.get('image') ?? '[]')); } catch { /* ignore */ }
    const slot = ['hero', 'home_banner', 'listing_inline'].includes(str(f, 'slot')) ? str(f, 'slot') : 'home_banner';
    const cta = str(f, 'cta_url', 300);
    await run('INSERT INTO banners (slot,title,body,cta_label,cta_url,image,starts_at,ends_at,video_url) VALUES (?,?,?,?,?,?,?,?,?)',
      slot, str(f, 'title', 120), str(f, 'body', 240) || null, str(f, 'cta_label', 40) || null, cta && safeUrl(cta) !== '#' ? cta : null,
      /^pub\/[\w.\-]+$/.test(img[0] ?? '') ? img[0] : null, str(f, 'starts_at', 10) || null, str(f, 'ends_at', 10) || null, video(str(f, 'video_url', 300)) ? str(f, 'video_url', 300) : null);
  }
  return redirect('/admin/banners');
};
