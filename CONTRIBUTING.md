# Contributing

Thank you for helping. This page explains how to make a change that is easy to accept.

## What we ask of every change

1. Use plain English in anything staff or customers read. Short sentences. No jargon. The admin is used by people who do not write code.
2. Never put a password, a key, a real phone number or a real person's details in the code, the docs, a test or a screenshot. Secrets belong in `.dev.vars` locally and in `wrangler secret` in production.
3. Keep every SQL query parameterised. Never build SQL with string pieces.
4. Keep private files private. Anything under `priv/` or `lead/` must stay checked in `src/pages/media/[...key].ts`.
5. Check any link a staff member can paste against exact hostnames, as `mapLink` and `video` do.
6. Add or update a test when you change `src/lib/pure.ts`, `parse.ts` or `chat.ts`.

## Where things are

1. `src/pages` is the site, the admin (`/admin`), the portal (`/portal`) and the API routes.
2. `src/lib` is the logic. The pure helpers are in `pure.ts` so plain Node can test them.
3. `migrations` is the database, in order. Add a new numbered file. Never edit an old one.
4. `docs` is the written help. Start with [How it works](docs/How%20it%20works.md).

## Running the checks

```bash
npm ci
npm test
npm run build
```

The same checks run on every pull request. `bash tests/smoke.sh` is a longer end-to-end check against a running dev server with a fresh local database.

## Trying a change safely

Use the local database only (`npm run db:local`). Never point a test at the real D1 database or R2 bucket. To get realistic data, run `bash demo/load.sh`.

## Sending a change

1. Make a branch.
2. Keep the change small and about one thing.
3. Run the checks.
4. Open a pull request. Say what changed, why, and how you tested it. A screenshot helps for anything you can see.

## Reporting a problem

Open an issue and choose the right form. Say what you expected and what happened. Never paste `.dev.vars` or any password.
