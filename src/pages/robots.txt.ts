export const GET = ({ url }: { url: URL }) =>
  new Response(`User-agent: *\nDisallow: /admin\nDisallow: /portal\nDisallow: /api\nSitemap: ${url.origin}/sitemap.xml\n`);
