import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Star, ChevronRight } from 'lucide-react';
import Image from 'next/image'; // Use Next.js Image

// Define the Property type (you can move this to a types.ts file)
type Property = {
  id: string;
  title: string;
  slug: string;
  property_type: string;
  status: string;
  price: number;
  location_city: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqft: number | null;
  photos: string[];
  is_featured: boolean;
};

// --- Reusable Property Card Component ---
// (You can move this to its own file like /components/PropertyCard.tsx)
function PropertyCard({ property }: { property: Property }) {
  const imageUrl = property.photos?.[0] || 'https://placehold.co/400x300/F1F3F6/6E6E6E?text=No+Image';

  return (
    <Link 
      href={`/properties/${property.slug}`}
      key={property.id}
      className="group bg-card rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-2 block border border-border-light"
    >
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={imageUrl}
          alt={property.title}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg ${
            property.status === 'sale' ? 'bg-accent-error text-white' : 'bg-accent-success text-white'
          }`}>
            For {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>
        {property.is_featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-accent-gold text-text-primary px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
              <Star className="w-4 h-4 fill-current" />
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          LKR {(property.price / 1000000).toFixed(1)}M
        </h3>
        <p className="text-lg font-semibold text-text-primary mb-1 truncate">{property.title}</p>
        <p className="text-text-secondary mb-4 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {property.location_city}
        </p>
        <div className="flex gap-4 text-sm text-text-secondary border-t border-border-light pt-4">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {property.bedrooms} beds
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {property.bathrooms} baths
            </div>
          )}
          {property.size_sqft && (
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              {property.size_sqft} sqft
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// --- Data Fetching Function ---
async function getPropertiesForSale() {
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, slug, status, price, location_city, bedrooms, bathrooms, size_sqft, photos, is_featured')
    .eq('status', 'sale'); // Filter for 'sale'

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
  return data as Property[];
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