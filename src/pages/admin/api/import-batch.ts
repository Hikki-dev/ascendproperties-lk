import type { APIRoute } from 'astro';
import { createDraft } from '../../../lib/drafts';

// JSON endpoint used by the chat-export importer: [{ text, photos: ['pub/…'] }]. Admin only (middleware).
export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return new Response('Forbidden', { status: 403 });
  let items: unknown;
  try { items = ((await request.json()) as { items?: unknown }).items; } catch { return new Response('Bad request', { status: 400 }); }
  if (!Array.isArray(items)) return new Response('Bad request', { status: 400 });
  const ids: number[] = [];
  for (const it of items.slice(0, 40) as { text?: unknown; photos?: unknown }[]) {
    const text = String(it?.text ?? '').trim().slice(0, 5000);
    if (text.length < 5) continue;
    const photos = Array.isArray(it?.photos) ? it.photos.map(String) : [];
    ids.push(await createDraft(text, photos));
  }
  return Response.json({ created: ids.length });
};
