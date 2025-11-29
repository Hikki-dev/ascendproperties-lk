"use server";

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ProfileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  avatarUrl: z.string().optional(),
});

export async function updateProfile(userId: string, formData: FormData) {
  const supabase = await createAdminClient();

  const validatedFields = ProfileSchema.safeParse({
    fullName: formData.get('fullName'),
    avatarUrl: formData.get('avatarUrl'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { fullName, avatarUrl } = validatedFields.data;

  // Update Supabase Auth User Metadata
  // Check if userId is a valid UUID (Supabase Auth ID)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

  // Upsert into profiles table (works for both Google and Email users)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    console.error('Error updating profiles table:', profileError);
    // Continue anyway to try updating Auth metadata if it's a UUID user
  }

  if (isUuid) {
    // Update Supabase Auth User Metadata for Email/Password users
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          full_name: fullName,
          avatar_url: avatarUrl
        }
      }
    );

    if (error) {
      console.error('Error updating auth metadata:', error);
      // If profiles table update failed too, then return error
      if (profileError) {
        return { message: 'Failed to update profile' };
      }
    }
  }

  revalidatePath('/');
  revalidatePath('/profile');
  
  return { message: 'Success! Profile updated.' };
}
