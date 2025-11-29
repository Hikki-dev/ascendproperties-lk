
import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function validateImages() {
  console.log('🔍 Validating property images...');

  const { data, error } = await supabase
    .from('properties')
    .select('title, slug, photos');

  if (error) {
    console.error('❌ Error fetching properties:', error.message);
    return;
  }

  for (const p of data) {
    if (!p.photos || p.photos.length === 0) {
      console.log(`❌ ${p.title}: No photos`);
      continue;
    }

    for (const url of p.photos) {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) {
          // console.log(`✅ ${p.title}: Image OK`);
        } else {
          console.error(`❌ ${p.title} (${p.slug}): Image failed (${res.status}) - ${url}`);
        }
      } catch (err) {
        console.error(`❌ ${p.title} (${p.slug}): Fetch error - ${url}`);
      }
    }
  }
  console.log('✨ Validation complete.');
}

validateImages();
