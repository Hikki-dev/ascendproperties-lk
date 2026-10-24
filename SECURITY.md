# Security

## Reporting a problem

Please do not open a public issue for a security problem. Use the **Report a vulnerability** button on the Security tab of this project on GitHub. Say what you found and how to repeat it.

## What this project protects

1. Passwords are hashed with PBKDF2-SHA256, 100,000 rounds and a salt for every user. Sessions are random 256-bit tokens in an `HttpOnly`, `SameSite=Lax` cookie, stored in D1 and expiring after 14 days.
2. `/admin/*` needs an admin session, and `/portal/*` needs a login. Astro's origin check refuses form posts from other websites.
3. All SQL is parameterised. Uploads are checked for type and size. Redirect targets, map links, video links and ad links are checked against exact hostnames.
4. Receipts and customer documents (`priv/`) are served only to the customer they belong to and to admins. Seller photos (`lead/`) are served only to admins.
5. Public forms have a honeypot, and Cloudflare Turnstile is enforced once its secret is set.
6. Every response has `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Strict-Transport-Security` headers. Admin and portal pages are never cached.

## What to keep in mind

1. The app has no rate limiting of its own. Add a Cloudflare WAF rate-limit rule for `/api/*` and `/login`, and turn on Bot Fight Mode.
2. Consider putting `/admin*` behind Cloudflare Access for a second login.
3. `seed.sql` and `demo/` create accounts and data for local testing. Never load them into a real database. The demo customer has a known password.
4. `wrangler.jsonc` holds the D1 `database_id`. It is an identifier, not a secret, but anyone deploying their own copy must replace it.
5. Keep `.dev.vars` and the admin password out of screenshots and bug reports.
