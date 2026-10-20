import type { APIRoute } from 'astro';
import { one, run } from '../../lib/db';
import { int, str, verifyTurnstile } from '../../lib/util';

// Only same-site relative paths may be used as redirect targets.
const back = (v: string, fallback: string) => (/^\/[a-z0-9\-/]*$/i.test(v) ? v : fallback);

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
  const f = await request.formData();
  const to = back(str(f, 'back', 120), '/contact');
  if (str(f, 'website')) return redirect(`${to}?sent=1`); // honeypot: pretend success
  const name = str(f, 'name', 100), phone = str(f, 'phone', 30);
  if (!name || !/^[+\d][\d\s\-()]{6,}$/.test(phone) || !(await verifyTurnstile(f, clientAddress))) return redirect(`${to}?err=1`);
  const lid = int(f, 'listing_id');
  const listingId = lid && (await one('SELECT id FROM listings WHERE id=?', lid)) ? lid : null;
  await run('INSERT INTO inquiries (listing_id,name,phone,email,message) VALUES (?,?,?,?,?)', listingId, name, phone, str(f, 'email', 120) || null, str(f, 'message', 1000) || null);
  return redirect(`${to}?sent=1`);
};
