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

  revalidatePath('/');
  revalidatePath('/profile');
  
  return { message: 'Success! Profile updated.' };
}
