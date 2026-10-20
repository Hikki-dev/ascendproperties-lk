import { all } from '../lib/db';

export const GET = async ({ url }: { url: URL }) => {
  const rows = await all<{ slug: string; updated_at: string }>("SELECT slug, updated_at FROM listings WHERE status IN ('available','sold')");
  const u = (p: string, d?: string) => `<url><loc>${url.origin}${p}</loc>${d ? `<lastmod>${d.slice(0, 10)}</lastmod>` : ''}</url>`;
  const body = ['/', '/lands', '/houses', '/apartments', '/sell-your-land', '/contact'].map((p) => u(p)).concat(rows.map((r) => u(`/listing/${r.slug}`, r.updated_at))).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
