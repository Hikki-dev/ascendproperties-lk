"use server";

import { createClient } from '@/lib/supabase/server'; // or admin client if needed, but server action can use standard client with getUser? 
// Actually for uploads easier to just use standard client if we want RLS, or Admin if we want to bypass. 
// User said "DB handles everything". Let's use standard client but we might need Admin for bypassing strict RLS if not set up yet.
// Safeguard: Use createClient (server) which has cookie context.
// But wait, the standard createClient in server actions might not have the session if called from a form? 
// Actually it should. But often for file uploads, using Service Role is robust for "System" uploads. 
// However, associating with User is better.
// Let's use the Service Role (Admin) for reliability to ensure writes happen, assuming the calling component validates permissions.

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  const bucket = (formData.get('bucket') as string) || 'properties';
  const path = (formData.get('path') as string) || `${Date.now()}-${file.name}`;

  if (!file) {
    return { error: 'No file provided' };
  }

  try {
    // Use Service Role key for backend upload to bypass RLS issues during development
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin
      .storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw error;
    }

    // Get Public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from(bucket)
      .getPublicUrl(path);

    return { url: publicUrl };
  } catch (error) {
    console.error('Upload handler error:', error);
    return { error: 'Failed to upload image' };
  }
}
