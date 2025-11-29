"use server";

import { createAdminClient } from '@/lib/supabase/server';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  const bucket = formData.get('bucket') as string;
  const path = formData.get('path') as string;

  if (!file || !bucket || !path) {
    return { error: 'Missing required fields' };
  }

  try {
    const supabase = await createAdminClient();
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return { error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return { url: publicUrlData.publicUrl };
  } catch (error) {
    console.error('Server upload error:', error);
    return { error: 'Internal server error' };
  }
}
