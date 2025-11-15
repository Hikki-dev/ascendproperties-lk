import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Star, ChevronRight } from 'lucide-react';
import { PropertyCard } from '@/components/PropertyCard'; // Import our new card
import type { Property } from '@/types/property'; // Import your main Property type
import Image from 'next/image'; // Use Next.js Image

// --- Data Fetching Function ---
async function getPropertiesForSale() {
  const { data, error } = await supabase
    .from('properties')
    // This select now correctly matches your imported 'Property' type
    .select('id, title, slug, status, price, location_city, location_district, bedrooms, bathrooms, size_sqft, photos, is_featured, property_type, description, amenities, created_at, views_count, video_url, agent_id, meta_title, meta_description, published_at, coordinates, updated_at')
    .eq('status', 'sale'); // Filter for 'sale'

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
  return data as Property[]; // This now uses the imported Property type
}


// --- The Page Component ---
export default async function BuyPage() {
  const properties = await getPropertiesForSale();

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-text-primary mb-8">
          Properties for Sale
        </h1>
        
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              // This now uses the imported PropertyCard component
              <PropertyCard key={property.id} property={property} /> 
            ))}
          </div>
        ) : (
          <p className="text-text-secondary">No properties currently listed for sale.</p>
        )}
      </div>
    </div>
  );
}