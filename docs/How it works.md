# How it works

This is the map for anyone who wants to change the code.

## One app on Cloudflare

Ascend Properties is a single [Astro](https://astro.build) app set to render on the server (`output: 'server'`), running as a Cloudflare Worker through `@astrojs/cloudflare`. It has no separate API server.

* **Pages** are `.astro` files in `src/pages`. They run on the server and send finished HTML.
* **Islands** are React components in `src/components` that load only where they are needed: `ImageUploader`, `LotsEditor`, `ChatImport` and `LoanCalc`.
* **Data** lives in **D1**, Cloudflare's SQLite database. Every query goes through three helpers in `src/lib/db.ts` (`all`, `one`, `run`), and every one is parameterised.
* **Files** live in **R2**, Cloudflare's file store, through the `MEDIA` binding.
* **Settings** the staff can edit (the WhatsApp number, the advisor, social links) live in a `settings` table with defaults in `src/lib/settings.ts`.

<p align="center"><a href="images/how-it-fits.svg"><img src="images/how-it-fits.svg" alt="How the site fits together" width="100%"></a></p>

## Who can see what

`src/middleware.ts` runs on every request.

1. It reads the `sid` cookie and looks the session up in D1 (`userFromToken`).
2. `/admin*` is only for a user whose role is `admin`. Everyone else is sent to `/login`.
3. `/portal*` needs any signed-in user.
4. It adds security headers, and makes admin and portal pages `no-store` so they are never cached.

Astro's `checkOrigin` rejects form posts from other websites.

## Passwords and sessions

`src/lib/auth.ts` hashes passwords with PBKDF2-SHA256 (100,000 rounds, which is the most a Worker allows) and a salt for every user. A session is a random 256-bit token stored in D1 with a 14-day expiry, and sent as an `HttpOnly`, `SameSite=Lax` cookie. The first admin is made from `ADMIN_EMAIL` and `ADMIN_PASSWORD` the first time that email signs in, and only while no admin exists.

## The data

| Table | What is in it |
|---|---|
| `users` | Staff and customers, with a `role` of `admin` or `customer` |
| `sessions` | Signed-in sessions |
| `listings` | Land, houses and apartments: price, district, facilities, pictures, highlights, nearby places, numbered plots, a video link and a `status` of draft, available or sold |
| `banners` | Home hero, home banner and in-grid sponsored slots, with run dates |
| `inquiries` | Questions about a listing, with a status of new, contacted or closed |
| `seller_leads` | "Sell your land" submissions with photos |
| `purchases`, `payments`, `documents` | The after-sales record for a customer |
| `tickets`, `ticket_messages` | Customer support conversations |
| `settings` | Editable contact details |

The migrations in `migrations/` are the source of truth. Several columns hold small JSON lists (`facilities`, `highlights`, `places`, `lots`, `images`), read safely with helpers in `src/lib/pure.ts`.

## Files and who can open them

Every file in R2 has a key that starts with a folder:

| Key starts with | What it is | Who can open it |
|---|---|---|
| `pub/` | Listing pictures and brochures | Anyone, cached for a long time |
| `priv/` | Receipts and customer documents | An admin, or the customer who owns the purchase it belongs to |
| `lead/` | Photos from "sell your land" | Admins only |

`src/pages/media/[...key].ts` checks this on every request. Uploads are limited by type (JPEG, PNG, WebP and PDF) and size (8 MB, or 15 MB for private files). Pictures are shrunk to at most 1,600 pixels in the staff member's browser before they are uploaded.

## Smart helpers for Sri Lanka

`src/lib/pure.ts` has the small pure functions that are easy to test:

* **`inWords`** says prices the way people say them: "5.5 lakhs", "1.2 million".
* **`lkPhone`** turns `077 123 4567`, `+94 77 123 4567` or `0112 345 678` into `94XXXXXXXXX`.
* **`mapLink`, `mapEmbed`, `video`** accept only exact Google Maps, YouTube, Facebook and TikTok hosts.
* **`lots`, `places`, `arr`** read the JSON columns safely.

`src/lib/parse.ts` reads a WhatsApp post and guesses the type, district, size, price and papers. `src/lib/chat.ts` finds every listing in an exported WhatsApp chat and pairs it with the photos sent alongside. They are covered by the tests in `tests/`.

## Where things are

```
migrations/         D1 schema, in order
seed.sql            five sample listings (delete before launch)
sample-data/               richer sample data and its loader
src/
├── middleware.ts   sessions, access rules, security headers
├── lib/            db, auth, util, pure, parse, chat, listings, drafts, settings
├── components/     React islands and Astro cards
├── layouts/        Base (public) and Admin
└── pages/          public site, /admin, /portal, /api, /media
tests/              unit tests (node --test) and smoke.sh
```
