
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBuckets() {
  const buckets = ['properties', 'avatars'];

  for (const bucket of buckets) {
    const { data, error } = await supabase.storage.getBucket(bucket);

    if (error && error.message.includes('not found')) {
      console.log(`Creating bucket: ${bucket}`);
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
      });

      if (createError) {
        console.error(`Error creating bucket ${bucket}:`, createError);
      } else {
        console.log(`Bucket ${bucket} created successfully.`);
      }
    } else if (data) {
      console.log(`Bucket ${bucket} already exists.`);
      // Ensure it is public
      if (!data.public) {
        console.log(`Updating bucket ${bucket} to be public...`);
        await supabase.storage.updateBucket(bucket, { public: true });
      }
    } else {
      console.error(`Error checking bucket ${bucket}:`, error);
    }
  }
}

setupBuckets();
