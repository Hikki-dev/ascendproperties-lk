
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

async function checkImages() {
  console.log('🔍 Checking property images...');

  const { data, error } = await supabase
    .from('properties')
    .select('title, slug, photos');

  if (error) {
    console.error('❌ Error fetching properties:', error.message);
    return;
  }

  data.forEach(p => {
    console.log(`\n🏠 ${p.title} (${p.slug})`);
    if (!p.photos || p.photos.length === 0) {
      console.log('   ❌ No photos');
    } else {
      p.photos.forEach((photo: string) => console.log(`   📷 ${photo}`));
    }
  });
}

checkImages();
