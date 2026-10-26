# Deploying

The site runs on Cloudflare: a Worker for the pages, **D1** for the data and **R2** for the files. The free tiers are large enough for a growing agency (D1 5 GB, R2 10 GB with no egress fees, 100,000 Worker requests a day).

## What you need

* A free [Cloudflare](https://dash.cloudflare.com) account.
* Node 22.22 or newer on your computer.

## First deploy

```bash
npx wrangler login
npx wrangler d1 create ascend-db          # copy the database_id it prints into wrangler.jsonc
npx wrangler r2 bucket create ascend-media
npm run db:remote                         # applies the migrations to the real database
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
npm run deploy                            # builds, then wrangler deploy
```

Wrangler prints the address of your site, like `https://ascendproperties-lk.<your-name>.workers.dev`. Sign in there at `/login` with the admin email and password. The first admin is made the first time that email signs in.

`seed.sql` is for local testing only. **Do not** load it, or `sample-data/`, into the real database.

## Your own domain

In the Cloudflare dashboard, open **Workers & Pages**, your Worker, then **Settings**, **Domains & Routes**, and add the domain.

## Protect it

1. Turn on **Bot Fight Mode** (Security, Bots).
2. Add a **rate-limit rule** (WAF) for `/api/*` and `/login`, to slow down password guessing.
3. Optional: put `/admin*` behind **Cloudflare Access** (free for up to 50 users) so staff need a second login before the app's own.
4. Optional: add **Turnstile** for the public forms. Create a widget, then:

   ```bash
   npx wrangler secret put TURNSTILE_SECRET
   ```

   and add `TURNSTILE_SITE_KEY` under `vars` in `wrangler.jsonc`. The forms enforce it by themselves once the secret exists.

## Updating

Run `npm run db:remote` if there are new files in `migrations/`, then `npm run deploy`.

To deploy on every push, connect the GitHub repository in **Workers & Pages**, **Builds**, with the build command `npm run build` and the deploy command `npx wrangler deploy`.

## Before you open it to the public

* Set your own WhatsApp number, advisor name and photo under **Contact & advisor**. Until you do, the site shows the defaults in `src/lib/settings.ts`, which belong to the original agency.
* Delete the sample listings under **Listings**.
* Change the admin password under **My password** if you shared the first one.
* Check the home page, a listing and `/portal` on a phone.
