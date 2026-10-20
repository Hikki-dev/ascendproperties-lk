import type { APIRoute } from 'astro';
import { run } from '../../../lib/db';
import { str } from '../../../lib/util';

export const POST: APIRoute = async ({ request, redirect }) => {
  const f = await request.formData();
  const wa = str(f, 'wa_number', 20).replace(/\D/g, '');
  if (wa.length < 9 || !str(f, 'advisor_name')) return redirect('/admin/settings?err=1');
  let photo = '';
  try { photo = String((JSON.parse(String(f.get('advisor_photo') ?? '[]')) as unknown[])[0] ?? ''); } catch { /* ignore */ }
  const vals: Record<string, string> = {
    wa_number: wa, phone_display: str(f, 'phone_display', 30), advisor_name: str(f, 'advisor_name', 60), advisor_title: str(f, 'advisor_title', 60),
    advisor_hours: str(f, 'advisor_hours', 60), address: str(f, 'address', 200), advisor_photo: /^pub\/[\w.\-]+$/.test(photo) ? photo : '',
  };
  for (const [k, v] of Object.entries(vals)) await run('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', k, v);
  return redirect('/admin/settings?saved=1');
};
