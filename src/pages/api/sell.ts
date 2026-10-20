import type { APIRoute } from 'astro';
import { run } from '../../lib/db';
import { lkPhone, saveFile, str, verifyTurnstile } from '../../lib/util';

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
  const f = await request.formData();
  if (str(f, 'website')) return redirect('/sell-your-land?sent=1');
  const name = str(f, 'name', 100), mobile = str(f, 'mobile', 30);
  if (!name || !lkPhone(mobile) || !(await verifyTurnstile(f, clientAddress))) return redirect('/sell-your-land?err=1');
  const keys: string[] = [];
  for (const file of f.getAll('photos').slice(0, 5)) {
    if (file instanceof File && file.size > 0) {
      const k = await saveFile(file, 'lead');
      if (!k) return redirect('/sell-your-land?err=1');
      keys.push(k);
    }
  }
  await run('INSERT INTO seller_leads (name,mobile,email,address,city,extent,price,description,images) VALUES (?,?,?,?,?,?,?,?,?)',
    name, mobile, str(f, 'email', 120) || null, str(f, 'address', 400) || null, str(f, 'city', 80) || null, str(f, 'extent', 40) || null, str(f, 'price', 40) || null, str(f, 'description', 1500) || null, JSON.stringify(keys));
  return redirect('/sell-your-land?sent=1');
};
