import { createAdminClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Star, ChevronRight } from 'lucide-react';
import { PropertyCard } from '@/components/PropertyCard';
import type { Property } from '@/types/property';
import Image from 'next/image';

// --- Data Fetching Function ---
async function getPropertiesForRent() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, slug, property_type, status, price, location_district, location_city, address, bedrooms, bathrooms, size_sqft, description, photos, amenities, is_featured, views_count, created_at')
    .eq('status', 'rent'); // Filter for 'rent'

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
  return data as Property[];
}


// --- The Page Component ---
export default async function RentPage() {
  const properties = await getPropertiesForRent();

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-text-primary mb-8">
          Properties for Rent
        </h1>
        
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} /> 
            ))}
          </div>
        ) : (
          <p className="text-text-secondary">No properties currently listed for rent.</p>
        )}
      </div>
    </div>
  );
}