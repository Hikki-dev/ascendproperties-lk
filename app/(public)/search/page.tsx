"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase/client';
import { PropertyCard } from '@/components/PropertyCard'; // Import our new card
import type { Property } from '@/types/property'; // Import your main Property type

function SearchResults() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const q = searchParams.get('q');
  const type = searchParams.get('type');
  const price = searchParams.get('price');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setErrorMsg('');
      
      let query = supabase
        .from('properties')
        .select('id, title, slug, status, price, location_city, location_district, bedrooms, bathrooms, size_sqft, photos, is_featured, property_type, description, amenities, created_at');

      // 1. Full-Text Search (for 'q' param)
      if (q) {
        // This formats the query string for FTS, e.g., "apartment in colombo" -> "apartment & colombo"
        const ftsQuery = q.trim().split(' ').join(' & ');
        query = query.textSearch('fts', ftsQuery);
      }
      
      // 2. Property Type Filter (for 'type' param)
      if (type && type !== 'all') {
        query = query.eq('property_type', type);
      }
      
      // 3. Price Range Filter (for 'price' param)
      if (price && price !== 'all') {
        if (price.includes('+')) {
          // e.g., "100m+"
          const minPrice = parseInt(price) * 1000000;
          query = query.gte('price', minPrice);
        } else if (price.includes('-')) {
          // e.g., "25m-50m"
          const [min, max] = price.split('-');
          const minPrice = parseInt(min) * 1000000;
          const maxPrice = parseInt(max) * 1000000;
          query = query.gte('price', minPrice).lte('price', maxPrice);
        }
      }

      // Only show properties that are for sale or rent
      query = query.in('status', ['sale', 'rent']);

      const { data, error } = await query;

      if (error) {
        console.error('Search error:', error);
        setErrorMsg('Failed to load properties. Please try again.');
      } else {
        setProperties(data as Property[]);
      }
      setLoading(false);
    };

    fetchProperties();
  }, [q, type, price]); // Re-run the search if params change

  if (loading) {
    return <div className="text-center text-text-secondary">Loading search results...</div>;
  }

  if (errorMsg) {
    return <div className="text-center text-accent-error">{errorMsg}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.length > 0 ? (
        properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))
      ) : (
        <p className="text-text-secondary md:col-span-3 text-center">
          No properties found matching your criteria.
        </p>
      )}
    </div>
  );
}

// Wrap the component in Suspense as required by Next.js when using useSearchParams
export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-text-primary">Search Results</h1>
      <Suspense fallback={<div className="text-center text-text-secondary">Loading...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}