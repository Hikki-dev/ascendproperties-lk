# How primelands.lk works (evidence, captured 2026-10-20)

All evidence was captured live in the browser (DOM scrape, network log, response headers) — not guessed.

## Architecture
| Finding | Evidence |
|---|---|
| Server-rendered PHP/Laravel app, no SPA | Forms carry `_token` hidden input + `<meta name=csrf-token>`; cookies `PHPSESSID`, `XSRF-TOKEN`; listing HTML arrives complete in the first response (`GET /land/en` → 200 `text/html`) |
| Behind Cloudflare (proxy/CDN/WAF) | `server: cloudflare`, `cf-ray`, `cf-cache-status: DYNAMIC`, `/cdn-cgi/rum`, Cloudflare email-decode script |
| Separate **CMS** holds all media | Every listing image is `https://plcms.primelands.lk/images/<yyMMddHHmmss><NAME>_<role>_<w>x<h>.webp` e.g. `260921110942SOLARA_-_MEEPE_Thumbnail_PL_450x550.webp`, `..._BOD_PL_1200x540.webp`, hero `..._Home_Slider_Desktop__1920x1080.webp`. Staff upload in an admin; images are pre-sized per slot (thumbnail 450x550, banner 1200x540, hero 1920x1080, logo 100x100) as WebP |
| Security headers | `content-security-policy: frame-ancestors 'none'`, HSTS preload, `x-content-type-options: nosniff`, `x-frame-options`, reCAPTCHA token (`g-recaptcha-response`) on every form |
| 3rd-party widgets | Tawk.to live chat, UserWay accessibility, AI voice widget, Cloudflare Insights, cookie-consent banner |
| Trilingual | `/en`, `/sin`, `/tam` suffix on every URL |

## Information architecture (nav)
Home · Portfolio Properties · Lands · Houses · Apartments (+ Upcoming Projects, Ongoing) · About · **Sell Your Land** · Contact · sister sites (Prime Residencies, Prime Marina) · Services · Testimonials · Careers · News · Online Publications · Blogs · Virtual Tour · KYC.

## Pages & behaviour
- **Home** `/en`: full-screen hero slider (admin-managed banners) + tabbed search (Lands / Houses / Apartments) with District select + keyword; animated stats (30 yrs, 18 districts, 300,000+ customers; counts of lands/houses/apartments); "Latest Listings" carousel (name – location, price LKR); featured houses/apartments carousels.
- **Listing index** `/land/en`: filter form via **GET** (`category, district, city, min_value, max_value, keyword`) → shareable URLs; 16 cards/page, `?page=N` (40 pages of lands). 14 land categories (Coconut, Water Front, Agriculture, Paddy facing, Up country, Close to highways/airport/railway, Residential, Commercial…). Houses & apartments have fewer filters (apartments split `ongoing`/completed).
- **Card**: thumbnail background, project name – area, location pin, price + unit label ("PER PERCH UPWARDS"), "Explore" CTA.
- **Detail** `/land/SOLARA-MEEPE/en` (slug = UPPER-NAME-AREA): banner image, logo, price, About, Payment Plan, Facilities (icons: electricity, water…), **Loan Calculator** (monthly payment), Google Map embed, brochure + hotline + location quick actions, **Inquire form** (`vName, vPhone, vEmail, tMessage, iProjectID`), "We also recommend" related cards. Rich SEO: meta description + schema.org `LocalBusiness` JSON-LD.
- **Sell Your Land** form: name, mobile, tel, email, address, description, city, extent, expected price, message, **multi-image upload** (`fImage[]`) → a seller-lead pipeline.
- **Contact** form: name, phone, email, location select, message.
- All forms POST to the server, store in DB, show a "Thank You!/Failed" modal.

## What the admin must therefore support (inferred from the above)
Projects CRUD (3 types + category tags), per-slot image uploads, price + unit label, payment plan, facilities, map location, brochure; hero banners (ads); seller submissions + inquiries inbox; testimonials/news/blog; stats counters.

## Our version (decisions)
- Same IA and URL idea, but **fast**: Astro SSR on Cloudflare Workers + React islands.
- **Admin CMS built in** (`/admin`) so no code edits to add listings, banners/ads, news, or handle leads.
- **After-sales** (not on Primelands): customer portal tracking payments, documents (deeds, receipts), handover status, and support tickets.
- Data: Cloudflare D1 (SQLite, free); images/brochures/docs: R2 (free 10 GB, no egress fees) served via Cloudflare Images-style resizing; protection: Turnstile on forms, WAF, Cloudflare Access on `/admin`.
