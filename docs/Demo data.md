# Demo data

`demo/` fills a **local** copy of the site with rich sample data, so the screens look like a real agency's. It is how the screenshots in the README were made.

## What it adds

| File | What it does |
|---|---|
| `demo/photos/` | Six real photographs from Wikimedia Commons (paddy field, tea estate, Beira Lake, a house, apartment towers). The credits and licences are in [Photo credits](Photo%20credits.md) |
| `demo/make_images.py` | Draws one picture with Pillow: the plot plan |
| `demo/demo-data.sql` | Adds plots, highlights, nearby places and pictures to the five sample listings, and three enquiries and two seller leads |
| `demo/load.sh` | Runs both, uploads the pictures to the local R2 store, then signs in as the admin and uses the real forms to add a customer, a purchase, three payments, a document and a handover stage |

All the people in it are made up.

## How to use it

1. `npm install`, `cp .dev.vars.example .dev.vars` and set `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
2. `npm run db:local`
3. `npm run dev`, and leave it running.
4. In another terminal: `bash demo/load.sh`

You need Python 3 with Pillow (`pip install pillow`) and `curl`.

Then sign in at `/portal` as `nimali@example.com` with the password `demo-customer-1` to see the customer's view, or at `/login` as the admin.

## Good to know

* It only touches the local database and the local R2 bucket in `.wrangler/state`. It never talks to Cloudflare.
* Run it on a fresh database. A second run adds the enquiries and leads again, cannot add the customer again because the email exists, and adds a second purchase.
* To start again, stop the dev server, delete the `.wrangler` folder and run `npm run db:local`.
* Never run it against production. It creates a customer with a known password.
