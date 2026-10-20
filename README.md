# Ascend Properties

Real-estate site (lands, houses, apartments) with a built-in admin CMS and customer after-sales portal.
Modelled on how primelands.lk works — see [docs/PRIMELANDS-RESEARCH.md](docs/PRIMELANDS-RESEARCH.md) for the evidence.

**Stack:** Astro (server-rendered) + React islands · Cloudflare Workers · D1 (SQLite DB) · R2 (images/docs).
All of it has a free tier large enough for a growing agency (D1 5 GB, R2 10 GB with no egress fees, Workers 100k requests/day).

## Run locally
```bash
npm install
cp .dev.vars.example .dev.vars     # set ADMIN_EMAIL / ADMIN_PASSWORD
npm run db:local                   # creates the local D1 DB + sample listings
npm run dev                        # http://localhost:4321
```
Sign in at `/login` with the admin email/password from `.dev.vars` (the first admin is created on first login).
`npm test` runs unit tests; `tests/smoke.sh` runs an end-to-end check against the dev server.

## What staff can do without touching code (`/admin`)
| Task | Where |
|---|---|
| Add / edit / hide / mark sold a listing, upload photos (auto-resized to WebP), brochure PDF, payment plan, facilities | Listings |
| Home hero, home banner, in-grid sponsored ads — with image, link and start/end dates | Banners & ads |
| See website inquiries and "sell your land" submissions (with photos), mark contacted/closed | Inquiries, Sell-your-land leads |
| **After-sales:** create a customer login, attach a purchase, record payments + receipts, upload documents (agreement, deed), set handover stage and next due date, answer support tickets | Customers & purchases, Support tickets |

Also in the admin: **Add from WhatsApp** (paste a posted message, get a hidden draft with district, size, price and papers filled in), per-listing **plots and prices**, **highlights**, **nearby places with distances**, a **video link** (YouTube/Facebook/TikTok, loaded only when tapped), **video ads**, and a printable **flyer** for each listing. Pasted links are checked against exact hostnames.

Customers sign in at `/portal` and see only their own purchases, balance, receipts, documents and tickets. Receipts/documents are stored privately in R2 and only served to the owner or an admin.

## Deploy to Cloudflare (replaces Vercel)
```bash
npx wrangler login
npx wrangler d1 create ascend-db          # paste the database_id into wrangler.jsonc
npx wrangler r2 bucket create ascend-media
npm run db:remote                         # apply migrations
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
npm run deploy
```
Then in the Cloudflare dashboard: add your domain (Workers → Settings → Domains), turn on **Bot Fight Mode** and a **WAF rate-limit rule** for `/api/*` and `/login`, and optionally put `/admin*` behind **Cloudflare Access** (free for ≤50 users) for a second login in front of the app.
Spam protection: create a Turnstile widget, then `wrangler secret put TURNSTILE_SECRET` and set `TURNSTILE_SITE_KEY` under `vars` — forms enforce it automatically once the secret exists.
Optional CI: connect the GitHub repo in Workers → Builds (build `npm run build`, deploy `npx wrangler deploy`).

## Security notes
- Passwords: PBKDF2-SHA256 (100k iterations, per-user salt). Sessions: random 256-bit token in an `HttpOnly`, `SameSite=Lax` cookie, stored in D1, 14-day expiry.
- `/admin/*` requires an admin session (middleware); `/portal/*` requires login; Astro `checkOrigin` rejects cross-site form posts (CSRF).
- All SQL is parameterised; uploads are type- and size-checked; redirect targets and ad links are validated; security headers set on every response.
- Honeypot + optional Turnstile on public forms. Add Cloudflare rate limiting for brute-force protection.

## Layout
```
migrations/   D1 schema            seed.sql     local sample data (delete before launch)
src/lib/      db, auth, util       src/pages/   public site, /admin, /portal, /api
src/components/  ImageUploader + LoanCalc (React islands), cards, ads
```
