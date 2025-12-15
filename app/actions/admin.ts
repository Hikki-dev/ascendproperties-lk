
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Helper to check admin permission
// Helper to check admin permission
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized: Not logged in.");
  }

  // 1. Hardcoded Super Admin (Safety net)
  if (session.user.email === 'admin@ascend.lk') return session;

  // 2. Check Database Role
  const supabase = await createAdminClient();
  
  // Assuming 'profiles' table has a 'role' column. 
  // If not, you should add it: `alter table profiles add column role text default 'user';`
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', (session.user as any).id)
    .single();

  const isAdmin = profile?.role === 'admin';

  if (!isAdmin) {
    throw new Error("Unauthorized: You must be an admin to perform this action.");
  }
  return session;
}

// --- Properties ---

export async function upsertProperty(data: any, id?: string) {
  try {
    await checkAdmin();
    const supabase = await createAdminClient();

    let query = supabase.from('properties');
    let result;

    if (id) {
       // Update
       result = await query.update(data).eq('id', id).select();
    } else {
       // Insert
       result = await query.insert([data]).select();
    }

    if (result.error) {
      console.error("Supabase Error (Property):", result.error);
      return { error: result.error.message };
    }

    revalidatePath('/admin/properties');
    revalidatePath('/search'); // Update search results
    revalidatePath('/'); // Update homepage
    if (result.data?.[0]?.slug) {
        revalidatePath(`/property/${result.data[0].slug}`);
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Server Action Error:", error);
    return { error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
}

export async function deleteProperty(id: string) {
    try {
        await checkAdmin();
        const supabase = await createAdminClient();
        
        const { error } = await supabase.from('properties').delete().eq('id', id);

        if (error) return { error: error.message };
        
        revalidatePath('/admin/properties');
        revalidatePath('/search');
        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : "Error deleting property" };
    }
}

// --- Blog Posts ---

export async function upsertPost(data: any, id?: string) {
    try {
      await checkAdmin();
      const supabase = await createAdminClient();
  
      let query = supabase.from('posts');
      let result;
  
      if (id) {
         // Update
         result = await query.update(data).eq('id', id).select();
      } else {
         // Insert
         result = await query.insert([data]).select();
      }
  
      if (result.error) {
        console.error("Supabase Error (Post):", result.error);
        return { error: result.error.message };
      }
  
      revalidatePath('/admin/blog');
      revalidatePath('/blog');
      if (result.data?.[0]?.slug) {
          revalidatePath(`/blog/${result.data[0].slug}`);
      }
  
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Server Action Error:", error);
      return { error: error instanceof Error ? error.message : "Unknown error occurred" };
    }
}

export async function deletePost(id: string) {
    try {
        await checkAdmin();
        const supabase = await createAdminClient();
        
        const { error } = await supabase.from('posts').delete().eq('id', id);

        if (error) return { error: error.message };
        
        revalidatePath('/admin/blog');
        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : "Error deleting post" };
    }
}
