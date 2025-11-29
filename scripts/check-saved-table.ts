
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

async function checkTable() {
  console.log('🔍 Checking saved_properties table...');

  const { error } = await supabase
    .from('saved_properties')
    .select('id')
    .limit(1);

  if (error) {
    console.error('❌ Error accessing saved_properties:', error.message);
    if (error.code === '42P01') {
        console.log('Table does not exist.');
    }
  } else {
    console.log('✅ saved_properties table exists and is accessible.');
  }
}

checkTable();
