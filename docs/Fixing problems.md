# Fixing problems

## `npm run dev` starts but every page is an error about `DB` or `MEDIA`

The local database does not exist yet. Run `npm run db:local` once.

## I cannot sign in

* Use the email and password from `.dev.vars`, and restart `npm run dev` after changing it.
* The first admin is only created while **no admin exists**. If you already signed in with a different email, that account is the admin. To start again, stop the dev server, delete the `.wrangler` folder and run `npm run db:local`.
* "Wrong email or password" is the same message for both, on purpose.

## The listings have grey boxes instead of pictures

The sample listings in `seed.sql` have no pictures. Upload some in the admin, or run `bash sample-data/load.sh` (see [Sample data](Sample%20data.md)).

## `sample-data/load.sh` says it cannot sign in, or does nothing

`npm run dev` must be running in another terminal, and `.dev.vars` must have `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Run `npm run db:local` first so the tables exist. If the site is not on port 4321, run `SITE=http://localhost:4322 bash sample-data/load.sh`.

## `sample-data/load.sh` fails at the pictures

It needs Python 3 with Pillow (`pip install pillow`).

## A form says "403" or nothing happens when I post from my own script

Astro refuses form posts from other websites. Send an `Origin` header that matches the site, like `-H "Origin: http://localhost:4321"` with curl.

## A picture will not upload

Pictures must be JPEG, PNG or WebP, and files for receipts and documents may also be PDFs. Public pictures can be up to 8 MB, and private files up to 15 MB.

## The WhatsApp buttons open a chat with the wrong number

Set the number under **Contact & advisor** in the admin. The country code goes first and there is no `+`, for example `94771234567`. Until you do, the buttons use the defaults in `src/lib/settings.ts`, which belong to the original agency.

## `npm run deploy` says the database id is wrong

Run `npx wrangler d1 create ascend-db` and put the `database_id` it prints into `wrangler.jsonc`. The one in the repository belongs to the author's account.

## A link or a video I pasted does not show

Only exact Google Maps links, and YouTube, Facebook and TikTok video links, are accepted. This is on purpose, so a staff member cannot be tricked into showing a harmful link.

## A page in a screenshot or test browser shows a dark toolbar at the bottom

That is Astro's development toolbar. It is not in the built site. Hide it with `astro preferences disable devToolbar`.

## Still stuck?

Open an issue and use the **Problem** template. Say what you ran, what you expected and what happened, and paste the error text. Never paste `.dev.vars`.
