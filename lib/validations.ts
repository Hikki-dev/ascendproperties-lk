import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().optional(), // We generate this if empty
  description: z.string().optional(),
  property_type: z.enum(['House', 'Apartment', 'Land', 'Commercial']),
  status: z.enum(['sale', 'rent', 'both', 'sold', 'off_market']),
  price: z.number().min(0, "Price must be a positive number"),
  location_city: z.string().min(1, "City is required"),
  location_district: z.string().min(1, "District is required"),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  size_sqft: z.number().min(0).optional(),
  photos: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
