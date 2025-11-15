import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Square, Star } from 'lucide-react';
import type { Property } from '@/types/property'; // Import your main Property type

export function PropertyCard({ property }: { property: Property }) {
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
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
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