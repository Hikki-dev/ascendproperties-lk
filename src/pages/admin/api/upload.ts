import type { APIRoute } from 'astro';
import { saveFile } from '../../../lib/util';

// Admin-only (middleware guards /admin/*). Used by the image uploader island.
export const POST: APIRoute = async ({ request }) => {
  const f = await request.formData();
  const file = f.get('file');
  const key = file instanceof File ? await saveFile(file, 'pub') : null;
  return key ? Response.json({ key }) : new Response('Bad file', { status: 400 });
};
