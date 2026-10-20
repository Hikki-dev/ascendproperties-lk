import type { APIRoute } from 'astro';
import { media, one } from '../../lib/db';

// pub/*  public listing images + brochures (long cache)
// priv/* receipts and customer documents: admin or the owning customer only
// lead/* seller-submitted photos: admin only
export const GET: APIRoute = async ({ params, locals }) => {
  const key = params.key ?? '';
  if (!/^(pub|priv|lead)\/[\w.\-]+$/.test(key)) return new Response('Not found', { status: 404 });
  const user = locals.user;
  if (!key.startsWith('pub/')) {
    let ok = user?.role === 'admin';
    if (!ok && user && key.startsWith('priv/')) {
      ok = !!(await one(
        `SELECT 1 x FROM purchases p WHERE p.user_id = ? AND (
           EXISTS (SELECT 1 FROM documents d WHERE d.purchase_id = p.id AND d.file = ?) OR
           EXISTS (SELECT 1 FROM payments y WHERE y.purchase_id = p.id AND y.receipt = ?))`, user.id, key, key));
    }
    if (!ok) return new Response('Forbidden', { status: 403 });
  }
  const obj = await media().get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  const h = new Headers();
  h.set('Content-Type', obj.httpMetadata?.contentType ?? 'application/octet-stream');
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('Cache-Control', key.startsWith('pub/') ? 'public, max-age=31536000, immutable' : 'private, no-store');
  return new Response(obj.body, { headers: h });
};
