# Questions and answers

**Do I need a Cloudflare account to try it?**
No. `npm run dev` uses a local copy of D1 and R2. You only need an account to put it on the internet.

**Is it a real agency's site?**
It is a working site built for a Sri Lankan property agency, modelled on primelands.lk. The sample listings in this repository, and the people in the demo data, are made up.

**Why Cloudflare and not Vercel?**
D1 and R2 have generous free tiers, R2 has no egress fees, and the Worker, the database and the files sit in one place. The project started on Vercel and Supabase and was rebuilt for Cloudflare in October 2026. See [Changes](../CHANGELOG.md).

**Can staff use it from a phone?**
Yes, that is the main way they are expected to. The admin has a collapsible menu and card lists, and photos are shrunk on the phone before they are uploaded.

**Can customers pay online?**
No. Payments are recorded by staff when money arrives, with a receipt, and the customer sees them in their portal. There is no online payment in the site.

**Can customers sign up by themselves?**
No. The agency creates each account, so only real customers have one.

**Does it send emails or SMS?**
No. The site works through WhatsApp links, phone calls and the admin's inbox of enquiries. Nothing is sent automatically.

**Is the Sinhala or Tamil language supported?**
Not yet. The site is in English. Prices are written the way Sri Lankans say them, such as "5.5 lakhs".

**How do I add many listings at once?**
Export the WhatsApp chat where you post them and use **Add from WhatsApp** in the admin. See the [Admin guide](Admin%20guide.md#add-from-whatsapp).

**How do I back up the data?**
Use `npx wrangler d1 export ascend-db --remote --output backup.sql` for the database. Files in R2 can be copied with any S3-compatible tool. Inquiries can also be downloaded as a CSV from the admin.

**Can I use the code?**
There is no licence file yet, so all rights are reserved for now. Ask first.
