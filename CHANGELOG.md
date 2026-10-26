# Changes

## Small fixes

1. Fixed: the admin Today page showed "20 perches perches" when a seller typed the unit themselves. A bare number still gets "perches", and the Sellers page now does the same. One new test.

## Docs and demo data

1. New README with a hero picture, a tour of the public site, the admin and the customer portal, two diagrams and a security summary.
2. New guides: Getting started, Admin guide, Customer portal, How it works, Deploying, Demo data, Fixing problems and Questions and answers.
3. New `demo/` folder: six drawn sample pictures, richer sample data and a loader script, so a local copy looks like a real agency's. It only touches the local database.
4. A Checks workflow, CONTRIBUTING, SECURITY and issue and pull request templates.
5. Fixed the README: uploaded photos are shrunk to JPEG in the browser (maximum 1,600 pixels), not WebP.
6. The sample listings now use real photographs from Wikimedia Commons, with credits and licences in `docs/Photo credits.md`, instead of drawn pictures. Only the plot plan is still drawn.
7. The README is now one long walkthrough of every screen, with a picture and a short explanation for each part. The pictures were retaken at twice the sharpness from a running copy filled with the sample data and the real photos.
8. Added an MIT licence, a link and badge for the live demo, a short legal section and a social preview picture.

## Rebuilt on Astro and Cloudflare (October 2026)

1. The whole site was rebuilt on Astro (server rendered) with React islands, on Cloudflare Workers, D1 and R2, with an admin and an after-sales portal.
2. A public redesign: a task-first search, listing rows, a WhatsApp advisor card and editable contact settings.
3. Sri Lanka details: prices in lakhs, Sri Lankan phone numbers, Google Maps links, a shortlist, share buttons and a visit date.
4. The admin works on phones: a collapsible menu, card lists and stacked tables. The wording is friendly for people who do not write code.
5. Richer listings: numbered plots with prices, highlights, nearby places, a video link and a lightbox. Video ads, a WhatsApp paste importer, a printable flyer and share previews.
6. Bulk import from a WhatsApp chat export zip. Listings and their photos become hidden drafts.
7. Safer Google Maps link checking.

## Luxury redesign (March 2026)

1. A gold and black premium theme.

## First version on Next.js and Supabase (November and December 2025)

1. A Next.js site with favourites, a blog, advanced search, admin improvements and database roles for admin sign-in.
2. Images moved from Cloudinary to Supabase Storage, mobile fixes and animated counters.
