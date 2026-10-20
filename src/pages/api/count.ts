import type { APIRoute } from 'astro';
import { countOnly } from '../../lib/listings';

// Live "Show N results" count for the search forms.
export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams, num = (k: string) => parseInt((q.get(k) ?? '').replace(/\D/g, ''), 10) || undefined;
  const type = ['land', 'house', 'apartment'].includes(q.get('type') ?? '') ? q.get('type')! : 'land';
  const n = await countOnly({ type, district: q.get('district') || undefined, min: num('min'), max: num('max'), q: q.get('q') || undefined });
  return Response.json({ n }, { headers: { 'Cache-Control': 'public, max-age=30' } });
};
