"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
// You'll need to create this reusable component
// import { PropertyCard } from '@/components/PropertyCard';

// This needs to match the type from your homepage
type Property = {
  id: string; 
  title: string;
  slug: string;
  // ... all other fields
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get('q');
  const type = searchParams.get('type');
  const price = searchParams.get('price');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      let query = supabase.from('properties').select('*, agents(name)');

      // Add filters based on URL params
      if (q) {
        // 'textSearch' is great if you have a full-text index
        // 'ilike' is a simpler wildcard search
        query = query.ilike('title', `%${q}%`);
      }
      if (type) {
        query = query.eq('property_type', type);
      }
      
      // TODO: Add logic for your price range (e.g., "25m-50m")
      // if (price === '25m-50m') {
      //   query = query.gte('price', 25000000).lte('price', 50000000);
      // }

      const { data, error } = await query;

      if (error) {
        console.error('Search error:', error);
      } else {
        setProperties(data as Property[]);
      }
      setLoading(false);
    };

    fetchProperties();
  }, [q, type, price]); // Re-run the search if params change

  if (loading) {
    return <div>Loading search results...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => (
            // <PropertyCard key={property.id} property={property} />
            <div key={property.id}>{property.title}</div> // Placeholder
          ))
        ) : (
          <p>No properties found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}