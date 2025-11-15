"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod schema to validate form data based on your 'properties' table
const PropertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(5, "Slug must be at least 5 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  property_type: z.enum(["house", "apartment", "land", "commercial"]), // Must match your ENUM
  status: z.enum(["sale", "rent"]), // Must match your ENUM
  price: z.coerce.number().min(1, "Price is required"),
  location_district: z.string().min(3, "District is required"),
  location_city: z.string().min(3, "City is required"),
  address: z.string().optional(),
  bedrooms: z.coerce.number().optional().nullable(),
  bathrooms: z.coerce.number().optional().nullable(),
  size_sqft: z.coerce.number().optional().nullable(),
  description: z.string().optional(),
  photos: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : []), // Converts "url1, url2" to string[]
  is_featured: z.coerce.boolean(),
});

export async function addProperty(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  const validatedFields = PropertySchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    property_type: formData.get("property_type"),
    status: formData.get("status"),
    price: formData.get("price"),
    location_district: formData.get("location_district"),
    location_city: formData.get("location_city"),
    address: formData.get("address"),
    bedrooms: formData.get("bedrooms"),
    bathrooms: formData.get("bathrooms"),
    size_sqft: formData.get("size_sqft"),
    description: formData.get("description"),
    photos: formData.get("photos"),
    is_featured: formData.get("is_featured") === "on",
  });

  if (!validatedFields.success) {
    console.error("Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return { 
      success: false, 
      message: "Invalid data. Please check the form.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  // Get the agent ID for the currently logged-in admin
  // This assumes the admin's user.id matches an agent.id
  // You may need to adjust this logic
  const { data: agentData, error: agentError } = await supabase
    .from('agents')
    .select('id')
    .eq('email', user.email!) // Find agent by the admin's email
    .single();

  if (agentError || !agentData) {
    console.error("Agent matching error:", agentError);
    return { success: false, message: "Could not find matching agent for this admin user." };
  }

  // Use the ADMIN client to bypass RLS for insertion
  const supabaseAdmin = await createAdminClient();
  
  const { data, error } = await supabaseAdmin
    .from("properties")
    .insert([
      {
        ...validatedFields.data,
        agent_id: agentData.id, // Assign the property to this agent
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Insert Error:", error);
    return { success: false, message: `Failed to add property: ${error.message}` };
  }

  revalidatePath("/buy");
  revalidatePath("/rent");
  revalidatePath("/");
  
  return { success: true, message: `Successfully added property: ${data.title}` };
}