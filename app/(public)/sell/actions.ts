"use server";

// CHANGED: Import the correct server-side admin client creator
import { createAdminClient } from '@/lib/supabase/server'; 
import { z } from 'zod'; // For validation

// Define the shape of our form data
const LeadSchema = z.object({
  full_name: z.string().min(3, "Name is required"),
  phone: z.string().min(10, "A valid phone number is required"),
  email: z.string().email("Invalid email address"),
  lead_type: z.enum(['sale', 'rent', 'other']), // Matches your DB
  message: z.string().optional(),
});

export async function submitLead(prevState: any, formData: FormData) {
  // ADDED: Instantiate the admin client inside the function
  // THIS IS THE FIX: Added 'await' here
  const supabaseAdmin = await createAdminClient();
  
  const validatedFields = LeadSchema.safeParse({
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    lead_type: formData.get('lead_type'),
    message: formData.get('message'),
  });

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      message: 'Validation failed',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Insert into 'leads' table (matches your schema)
  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert([
      {
        full_name: validatedFields.data.full_name,
        phone: validatedFields.data.phone,
        email: validatedFields.data.email,
        lead_type: validatedFields.data.lead_type,
        message: validatedFields.data.message,
        source: 'Website Sell Page'
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return { message: 'Database error: Could not save lead.' };
  }

  return { message: 'Success! Your request has been sent.', lead_id: data.id };
}