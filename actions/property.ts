"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function toggleSaveProperty(propertyId: string, userId: string) {
  const supabase = await createAdminClient();
  
  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_properties')
    .select('*')
    .eq('property_id', propertyId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Remove
    await supabase
      .from('saved_properties')
      .delete()
      .eq('id', existing.id);
    return { saved: false };
  } else {
    // Add
    await supabase
      .from('saved_properties')
      .insert([{ property_id: propertyId, user_id: userId }]);
    return { saved: true };
  }
}

export async function checkIsSaved(propertyId: string, userId: string) {
  const supabase = await createAdminClient();
  
  const { data } = await supabase
    .from('saved_properties')
    .select('*')
    .eq('property_id', propertyId)
    .eq('user_id', userId)
    .single();
    
  return !!data;
}

export async function getSavedProperties(userId: string) {
  const supabase = await createAdminClient();
  
  const { data, error } = await supabase
    .from('saved_properties')
    .select(`
      property_id,
      properties:property_id (
        id,
        title,
        slug,
        price,
        location_city,
        bedrooms,
        bathrooms,
        size_sqft,
        photos,
        status,
        is_featured,
        property_type
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching saved properties:', error);
    return [];
  }

  // Flatten the structure to return an array of properties
  return data.map((item: any) => item.properties).filter(Boolean);
}
