import { defineMiddleware } from 'astro:middleware';
import { userFromToken } from './lib/auth';

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { pathname } = ctx.url;
  const needsAuth = pathname.startsWith('/admin') || pathname.startsWith('/portal');
  const sid = ctx.cookies.get('sid')?.value;
  const user = sid ? await userFromToken(sid) : null;
  ctx.locals.user = user;

  if (pathname.startsWith('/admin') && user?.role !== 'admin') return ctx.redirect(`/login?next=${encodeURIComponent(pathname)}`);
  if (pathname.startsWith('/portal') && !user) return ctx.redirect(`/login?next=${encodeURIComponent(pathname)}`);

  const res = await next();
  const h = new Headers(res.headers);
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('X-Frame-Options', 'DENY');
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  if (needsAuth) h.set('Cache-Control', 'private, no-store');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
});
