
import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkSpecificProperty() {
  const slug = 'luxury-penthouse-360-city-views';
  console.log(`🔍 Checking property: ${slug}`);

  const { data, error } = await supabase
    .from('properties')
    .select('title, slug, photos')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`Title: ${data.title}`);
  console.log(`Photos:`, data.photos);

  if (data.photos && data.photos.length > 0) {
    for (const url of data.photos) {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        console.log(`URL: ${url} -> Status: ${res.status}`);
      } catch (err) {
        console.error(`URL: ${url} -> Error: ${err}`);
      }
    }
  }
}

checkSpecificProperty();
