"use client";

import Link from 'next/link';
import { SaveButton } from '@/components/property/SaveButton';
import Image from 'next/image';
import { MapPin, Bed, Bath, Square, Star } from 'lucide-react';
import type { Property } from '@/types/property';
import { useState } from 'react';

export function PropertyCard({ property }: { property: Property }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = property.photos?.[0] || 'https://placehold.co/600x400.png?text=No+Image';

  return (
    <Link
      href={`/property/${property.slug}`}
      key={property.id}
      className="group block bg-white luxury-card-glow overflow-hidden border border-border-light/50 hover:border-primary/20 transition-all duration-700"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageError ? 'https://placehold.co/600x400?text=No+Image' : imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImageError(true)}
          unoptimized
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Save Button */}
        <div className="absolute top-4 right-4 z-10">
          <SaveButton propertyId={property.id} />
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 text-[10px] font-medium tracking-widest uppercase ${
            property.status === 'sale'
              ? 'bg-dark/80 backdrop-blur-sm text-white border border-white/20'
              : 'bg-primary/90 backdrop-blur-sm text-dark border border-primary/40'
          }`}>
            For {property.status === 'sale' ? 'Sale' : 'Lease'}
          </span>
        </div>

        {/* Featured Badge */}
        {property.is_featured && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-primary/90 backdrop-blur-sm text-dark px-4 py-1.5 text-[10px] font-medium tracking-widest uppercase flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-current" />
              Exclusive
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Gold accent line */}
        <div className="w-8 h-[1px] bg-primary mb-4" />

        <h3 className="font-serif text-xl md:text-2xl font-semibold text-dark mb-1.5 group-hover:text-primary/90 transition-colors duration-300">
          LKR {(property.price / 1000000).toFixed(1)}M
        </h3>
        <p className="text-sm font-medium text-dark/80 mb-1 truncate tracking-wide">{property.title}</p>
        <p className="text-text-secondary text-xs mb-5 flex items-center gap-1 tracking-wide">
          <MapPin className="w-3 h-3 text-primary" />
          {property.location_city}
        </p>

        <div className="flex gap-5 text-xs text-text-secondary border-t border-border-light/50 pt-4 tracking-wide">
          {property.bedrooms && (
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-primary/60" />
              {property.bedrooms} Beds
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-primary/60" />
              {property.bathrooms} Baths
            </div>
          )}
          {property.size_sqft && (
            <div className="flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5 text-primary/60" />
              {property.size_sqft.toLocaleString()} sqft
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
