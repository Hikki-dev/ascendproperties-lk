# Getting started

This page takes you from an empty folder to a working copy of the site on your own computer.

## What you need

* **Node 22.22 or newer** (`node -v` shows it). Astro 7 and Wrangler 4 need it. That is all. Wrangler, which comes with the project, runs a local copy of Cloudflare's database (D1) and file store (R2) for you, so you do not need a Cloudflare account to try it.

## 1. Get the code and the packages

```bash
git clone https://github.com/Hikki-dev/ascendproperties-lk.git
cd ascendproperties-lk
npm install
```

## 2. Make your secrets file

```bash
cp .dev.vars.example .dev.vars
```

Open `.dev.vars` and set:

| Name | What it is |
|---|---|
| `ADMIN_EMAIL` | The email you will use to sign in as the admin |
| `ADMIN_PASSWORD` | A long password for it |
| `TURNSTILE_SECRET`, `TURNSTILE_SITE_KEY` | Leave empty. They switch on Cloudflare's spam check, which you do not need locally |

`.dev.vars` is git-ignored. Never commit it.

## 3. Create the database

```bash
npm run db:local
```

This builds the tables in a local database and adds five sample listings from `seed.sql`.

## 4. Start the site

```bash
npm run dev
```

Open <http://localhost:4321>. Sign in at `/login` with the email and password from `.dev.vars`. The first admin account is made the first time you sign in, and only while no admin exists yet.

## 5. Make it look lived-in (optional)

The five sample listings have no pictures. To fill the local copy with real sample photos, plots, highlights, enquiries and a customer with a purchase, leave `npm run dev` running and, in a second terminal:

```bash
bash sample-data/load.sh
```

See [Sample data](Sample%20data.md).

## 6. Take the tour

1. Open a listing as a visitor. Try the WhatsApp button, the visit-day picker and the flyer link.
2. Sign in as the admin. On **Today**, press **+ Add a new listing**.
3. Open **Add from WhatsApp** and paste a message, for example:

   ```
   Green Valley Plots, Habaraduwa Galle
   10 - 25 perches
   Rs 5.5 lakhs per perch
   Clear deed, electricity, water, tarred road
   ```
4. Open **Customers & purchases**, add a customer, then add a purchase and a payment. Sign in as that customer at `/portal` in a private window to see what they see.

## Checks

```bash
npm test             # 12 unit tests
npm run build        # builds the Worker into dist/
bash tests/smoke.sh  # end-to-end, against the running dev server
```

`tests/smoke.sh` signs in with `admin@ascend.local` and the password `ascend-dev-pass-123`, so put those in `.dev.vars` first, and use a fresh local database (`npm run db:local`) because the script adds data.

If something does not work, start with [Fixing problems](Fixing%20problems.md).
