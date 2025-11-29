
import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyAccess() {
  console.log('🔍 Verifying public access to "properties" table...');

  // 1. Check total count
  const { count, error: countError } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Error fetching total count:', countError.message);
    return;
  }
  console.log(`✅ Total properties: ${count}`);

  // 2. Check Property Types
  const types = ['House', 'Apartment', 'Land', 'Commercial'];
  console.log('\n📊 Checking Property Types:');
  for (const type of types) {
    const { count: typeCount, error: typeError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('property_type', type);
    
    if (typeError) {
      console.error(`❌ Error fetching ${type}:`, typeError.message);
    } else {
      console.log(`   - ${type}: ${typeCount}`);
    }
  }

  // 3. Check actual values in DB
  console.log('\n🕵️ Checking actual property_type values in DB...');
  const { data: allProps, error: allError } = await supabase
    .from('properties')
    .select('property_type')
    .limit(50);

  if (allError) {
    console.error('❌ Error fetching all props:', allError.message);
  } else {
    const distinctTypes = [...new Set(allProps.map(p => p.property_type))];
    console.log('✅ Distinct property_type values found:', distinctTypes);
  }
}

verifyAccess();
