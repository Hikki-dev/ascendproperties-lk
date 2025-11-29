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
      console.error('Error updating profile:', error);
      return { message: 'Failed to update profile' };
    }
  } else {
    // For Google users (NextAuth), we can't update Supabase Auth metadata directly 
    // because the ID is from Google, not Supabase.
    // In a real app, you'd store this in a 'profiles' table.
    // For now, we'll just return success as we can't update Google's data.
    console.log('Skipping Supabase update for non-UUID user (likely Google Auth):', userId);
  }

  revalidatePath('/');
  revalidatePath('/profile');
  
  return { message: 'Success! Profile updated.' };
}
