# Ascend Properties

[![Checks](https://github.com/Hikki-dev/ascendproperties-lk/actions/workflows/checks.yml/badge.svg)](https://github.com/Hikki-dev/ascendproperties-lk/actions/workflows/checks.yml)
![Astro](https://img.shields.io/badge/Astro-server%20rendered-BC52EE?logo=astro&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers%20%7C%20D1%20%7C%20R2-F6821F?logo=cloudflare&logoColor=white)
[![Live demo](https://img.shields.io/badge/live-demo-1D4ED8)](https://ascendproperties-lk.makkoacknowledgesstress.workers.dev)
[![Licence: MIT](https://img.shields.io/github/license/Hikki-dev/ascendproperties-lk)](LICENSE)
![React](https://img.shields.io/badge/React-islands-61DAFB?logo=react&logoColor=black)

A real-estate website for Sri Lanka (lands, houses and apartments) with a built-in admin that staff can use without touching code, and a private portal where customers follow what they have bought. It runs entirely on Cloudflare's free tier.

<p align="center"><img src="docs/images/hero.jpg" alt="The home page, a land listing with plots and prices, and the same listing on a phone" width="100%"></p>

<p align="center"><sub>Screenshots of a local copy with the sample data from <code>demo/</code>. They were taken before the real sample photos were added, so the listing pictures in them are the old drawn ones. The demo data now uses real photographs, credited in <a href="docs/Photo%20credits.md">Photo credits</a>. The live demo does not show listing photos yet.</sub></p>

Buyers pick an area and a budget and see the real price per perch and the payment plan. Staff add listings from a phone. Customers sign in and see their balance, receipts and documents. It is modelled on how primelands.lk works, and [the research](docs/PRIMELANDS-RESEARCH.md) shows the evidence.

## On this page

* [What you get](#what-you-get)
* [How everything fits together](#how-everything-fits-together)
* [Try it](#try-it): run it on your computer with sample data
* [A tour of the site](#a-tour-of-the-site)
  * [For buyers](#for-buyers)
  * [For staff](#for-staff-admin)
  * [For customers](#for-customers-portal)
* [Deploy to Cloudflare](#deploy-to-cloudflare)
* [Your privacy and safety](#your-privacy-and-safety)
* [Help and more reading](#help-and-more-reading)

## What you get

| | |
|---|---|
| **Search that fits how people think** | "I want land, in Galle, under 600,000 a perch." Prices are shown in rupees and in lakhs, with the monthly instalment |
| **Rich listings** | Many photos, plots and prices for each numbered plot, highlights, nearby places with times, a video link, a map link, a printable flyer, and sharing on WhatsApp |
| **WhatsApp first** | Every listing has "Ask on WhatsApp" and "Call" buttons that carry the listing name, and a visit-day picker |
| **Sell your land** | A form where owners send details and photos to the agency |
| **Admin for non-technical staff** | Add, edit, hide or mark sold, with photos shrunk on the phone. Paste a WhatsApp post, or a whole chat export, and get hidden draft listings back |
| **After-sales portal** | A login for each customer with their purchases, payments, receipts, documents, handover stage and support tickets |
| **Banners and ads** | A home hero, a banner and sponsored slots in the listing grid, with start and end dates |
| **Fast and cheap** | Cloudflare Workers, D1 and R2 free tiers are enough for a growing agency |

## How everything fits together

<p align="center"><a href="docs/images/how-it-fits.svg"><img src="docs/images/how-it-fits.svg" alt="Diagram: buyers, customers and staff all use one Cloudflare Worker running Astro. It keeps data in D1, pictures and files in R2, and sends people to WhatsApp with links" width="100%"></a></p>

There is one app and no separate API server. The pages are rendered on the server by Astro, and the few interactive parts (the photo uploader, the plots table, the loan calculator and the chat importer) are small React islands.

After a sale, the customer's journey looks like this:

<p align="center"><a href="docs/images/after-sales.svg"><img src="docs/images/after-sales.svg" alt="Diagram: an enquiry, a purchase added by staff, payments with receipts, documents, and handover in five stages" width="100%"></a></p>

The longer story is in [How it works](docs/How%20it%20works.md).

## Try it

**[Open the live demo](https://ascendproperties-lk.makkoacknowledgesstress.workers.dev).** It is the public site running on Cloudflare with a few sample listings (their names start with "Demo"). The admin (`/admin`) and customer portal (`/portal`) need a login, so they are not open to visitors; the pictures below show them.

To run your own copy on your computer:

You need Node 22.22 or newer (Astro 7 requires it). There is nothing to install in the cloud: Wrangler runs a local copy of D1 and R2 for you.

```bash
git clone https://github.com/Hikki-dev/ascendproperties-lk.git
cd ascendproperties-lk
npm install
cp .dev.vars.example .dev.vars     # set ADMIN_EMAIL and ADMIN_PASSWORD
npm run db:local                   # creates the local database and five sample listings
npm run dev                        # http://localhost:4321
```

Sign in at `/login` with the admin email and password from `.dev.vars`. The first admin is created the first time you sign in.

**Want it to look like the screenshots?** With `npm run dev` still running, in a second terminal:

```bash
bash demo/load.sh
```

That draws six sample pictures, fills in plots, highlights and nearby places, adds some enquiries and leads, and creates a customer with a purchase, three payments and a document. Sign in at `/portal` as `nimali@example.com` with the password `demo-customer-1`. Details are in [Demo data](docs/Demo%20data.md). It only touches your local copy.

`npm test` runs the unit tests (11 of them, all passing). `tests/smoke.sh` runs a longer end-to-end check against the dev server. Step by step, with fixes for the usual snags, is in [Getting started](docs/Getting%20started.md).

## A tour of the site

Click a picture to see it full size.

### For buyers

<a href="docs/images/home.jpg"><img src="docs/images/home.jpg" alt="Home page with a search for land by place and budget, and the newest listings" width="100%"></a>

The home page asks one question: *what kind of place are you looking for?* Buyers choose a type, an area and a budget, or tap a shortcut like "Near Colombo" or "Instalments, no bank loan".

<a href="docs/images/land.jpg"><img src="docs/images/land.jpg" alt="Land results with filters for district, maximum price, keyword and must-have features" width="100%"></a>

Results show the real price per perch, the price in lakhs, and the monthly instalment, with filters for the things people really ask about: a clear deed, electricity, water and an instalment plan.

<a href="docs/images/listing.jpg"><img src="docs/images/listing.jpg" alt="A listing with photos, a plot plan, price, advisor card and WhatsApp buttons" width="100%"></a>

<a href="docs/images/listing-plots.jpg"><img src="docs/images/listing-plots.jpg" alt="The plots and prices table for a listing, with sold, reserved and available plots" width="100%"></a>

A listing can have a table of numbered plots, each with its size, price and status (available, reserved or sold). The side card has the advisor, WhatsApp and call buttons, a visit-day picker, and a printable flyer.

<p align="center">
<img src="docs/images/home-mobile.jpg" alt="The home page on a phone" width="32%">
<img src="docs/images/listing-mobile.jpg" alt="A listing on a phone with a WhatsApp button fixed to the bottom" width="32%">
</p>

On a phone the menu collapses, the filters fold away, and a WhatsApp and Call bar stays at the bottom.

<a href="docs/images/sell.jpg"><img src="docs/images/sell.jpg" alt="Sell your land form with contact details, land information and photos" width="100%"></a>

### For staff (admin)

<a href="docs/images/admin-dashboard.jpg"><img src="docs/images/admin-dashboard.jpg" alt="Admin home: buyers waiting for a reply, sellers waiting, and three steps to add a listing" width="100%"></a>

The admin opens on **Today**: who has asked about a property, who wants to sell, with buttons to reply on WhatsApp or call. It uses plain words on purpose.

<a href="docs/images/admin-listings.jpg"><img src="docs/images/admin-listings.jpg" alt="Listings table with a picture, type, district, price and status" width="100%"></a>

<a href="docs/images/admin-listing-edit.jpg"><img src="docs/images/admin-listing-edit.jpg" alt="Edit a listing: the basics, whether it is on the website, and photos" width="100%"></a>

Adding a listing takes four boxes and some photos. "Is it on the website?" is a simple choice between show, sold out and hide.

<a href="docs/images/admin-import.jpg"><img src="docs/images/admin-import.jpg" alt="Add listings from WhatsApp: import a whole chat export or paste one message" width="100%"></a>

**Add from WhatsApp** is the time-saver: paste a posted message, or drop in a whole exported chat, and each listing it finds becomes a hidden draft with the district, size, price and papers filled in. Staff check it, then publish.

<a href="docs/images/admin-inquiries.jpg"><img src="docs/images/admin-inquiries.jpg" alt="Inquiries with reply on WhatsApp, call and email buttons and a status choice" width="100%"></a>

<a href="docs/images/admin-banners.jpg"><img src="docs/images/admin-banners.jpg" alt="Banners and ads with slots, run dates and a form for a new banner" width="100%"></a>

<a href="docs/images/admin-customers.jpg"><img src="docs/images/admin-customers.jpg" alt="Customers and purchases table with paid and total amounts" width="100%"></a>

<a href="docs/images/admin-customer.jpg"><img src="docs/images/admin-customer.jpg" alt="One customer: handover stage, payments with receipts, and documents shown to the customer" width="100%"></a>

For each customer, staff record payments with receipts, upload documents such as the agreement and the deed, set the handover stage and the next due date, and answer support tickets.

More: [sellers' leads](docs/images/admin-sellers.jpg), [contact and advisor settings](docs/images/admin-settings.jpg) and [support tickets](docs/images/admin-tickets.jpg). The full list of what staff can do is in the [Admin guide](docs/Admin%20guide.md).

### For customers (portal)

<a href="docs/images/portal.jpg"><img src="docs/images/portal.jpg" alt="Customer portal with total price, amount paid, balance, next instalment, handover progress, payment history and documents" width="100%"></a>

A customer signs in at `/portal` and sees only their own purchases: the total, what they have paid, the balance, the next instalment, the five handover stages, every payment with its receipt, their documents, and a place to open a support ticket. See [Customer portal](docs/Customer%20portal.md).

## Deploy to Cloudflare

```bash
npx wrangler login
npx wrangler d1 create ascend-db          # paste the database_id into wrangler.jsonc
npx wrangler r2 bucket create ascend-media
npm run db:remote                         # apply migrations
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
npm run deploy
```

Then in the Cloudflare dashboard add your domain, turn on **Bot Fight Mode** and a rate-limit rule for `/api/*` and `/login`, and, if you like, put `/admin*` behind **Cloudflare Access** (free for up to 50 users) for a second login. Spam protection with Turnstile is optional. All the steps, including the optional ones, are in [Deploying](docs/Deploying.md).

## Your privacy and safety

* Passwords are hashed with PBKDF2-SHA256 (100,000 rounds, a salt for every user). A session is a random 256-bit token in an `HttpOnly`, `SameSite=Lax` cookie, kept in D1, and it expires after 14 days.
* `/admin/*` needs an admin session and `/portal/*` needs a login. Forms from other websites are refused (Astro's origin check).
* Every SQL query is parameterised. Uploads are checked for type and size. Redirects, map links and video links are checked against exact hostnames.
* Receipts and customer documents are private. They are served only to their owner or an admin. Seller photos are for admins only.
* Public forms have a hidden honeypot field, and Cloudflare Turnstile turns on by itself once its secret exists.
* Security headers are set on every response.

To report a security problem, read [SECURITY.md](SECURITY.md).

## Help and more reading

| If you want to | Read |
|---|---|
| Run it step by step | [Getting started](docs/Getting%20started.md) |
| Use the admin | [Admin guide](docs/Admin%20guide.md) |
| See what customers see | [Customer portal](docs/Customer%20portal.md) |
| Understand how it is built | [How it works](docs/How%20it%20works.md) |
| Put it on Cloudflare | [Deploying](docs/Deploying.md) |
| Fill a local copy with sample data | [Demo data](docs/Demo%20data.md) |
| See who took the sample photos | [Photo credits](docs/Photo%20credits.md) |
| Fix a problem | [Fixing problems](docs/Fixing%20problems.md) |
| Find a quick answer | [Questions and answers](docs/FAQ.md) |
| See why it works like primelands.lk | [Research](docs/PRIMELANDS-RESEARCH.md) |
| Change the code | [Contributing](CONTRIBUTING.md) |
| See what changed | [Changes](CHANGELOG.md) |

## Layout

```
migrations/      D1 schema            seed.sql   five sample listings (delete before launch)
src/lib/         db, auth, util, parse, chat      src/pages/   public site, /admin, /portal, /api
src/components/  ImageUploader, LoanCalc, LotsEditor, ChatImport (React islands), cards, ads
demo/            richer sample data and the script that loads it
tests/           unit tests and an end-to-end smoke script
```

## Legal and responsibility

* Ascend Properties is a portfolio and learning project, not a real agency's site. The listings in the demo are samples.
* The code is released under the [MIT licence](LICENSE), as it is, with no promises.
* [primelands.lk](docs/PRIMELANDS-RESEARCH.md) is studied only for how a site like this works. This project is not connected to it.

## Contributing

Fixes and ideas are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## Credits

Built with [Astro](https://astro.build), [React](https://react.dev) and [Cloudflare Workers](https://workers.cloudflare.com). Zip handling is by [fflate](https://github.com/101arrowz/fflate).

Built by [Yusuf (Hikki-dev)](https://github.com/Hikki-dev).
