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
  
  // New state for advanced filters
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [beds, setBeds] = useState(searchParams.get('beds') || '');
  const [baths, setBaths] = useState(searchParams.get('baths') || '');
  const [minSize, setMinSize] = useState(searchParams.get('minSize') || '');
  const [maxSize, setMaxSize] = useState(searchParams.get('maxSize') || '');
  const [status, setStatus] = useState(searchParams.get('status') || ''); // 'sale', 'rent', or empty for both
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest'); // 'newest', 'price-asc', 'price-desc'

  const q = searchParams.get('q');
  const type = searchParams.get('type');
  const price = searchParams.get('price');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setErrorMsg('');
      
      let query = supabase
        .from('properties')
        // Select all fields your PropertyCard might need
        .select('id, title, slug, status, price, location_city, location_district, bedrooms, bathrooms, size_sqft, photos, is_featured, property_type, description, amenities, created_at, views_count, video_url, agent_id, meta_title, meta_description, published_at, coordinates, updated_at');

      // 1. Full-Text Search (for 'q' param)
      if (q) {
        const ftsQuery = q.trim().split(' ').join(' & ');
        query = query.textSearch('fts', ftsQuery);
      }
      
      // 2. Property Type Filter (for 'type' param)
      if (type && type !== 'all') {
        query = query.eq('property_type', type);
      }
      
      // 3. Price Range (Manual inputs now)
      if (minPrice) {
        query = query.gte('price', parseInt(minPrice));
      }
      if (maxPrice) {
        query = query.lte('price', parseInt(maxPrice));
      }

      // 4. Beds & Baths
      if (beds && beds !== 'any') {
        if (beds === '4+') query = query.gte('bedrooms', 4);
        else query = query.eq('bedrooms', parseInt(beds));
      }
      if (baths && baths !== 'any') {
         if (baths === '4+') query = query.gte('bathrooms', 4);
         else query = query.eq('bathrooms', parseInt(baths));
      }

      // 5. Land/Floor Size
      if (minSize) query = query.gte('size_sqft', parseInt(minSize));
      if (maxSize) query = query.lte('size_sqft', parseInt(maxSize));

      // 6. Status & Sort
      if (status && status !== 'all') {
        query = query.eq('status', status);
      } else {
        query = query.in('status', ['sale', 'rent']);
      }

      if (sort === 'newest') query = query.order('created_at', { ascending: false });
      if (sort === 'price-asc') query = query.order('price', { ascending: true });
      if (sort === 'price-desc') query = query.order('price', { ascending: false });

      // Only show properties that are for sale or rent


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
    fetchProperties();
  }, [q, type, price, minPrice, maxPrice, beds, baths, minSize, maxSize, status, sort]); // Depend on all filter states

  if (loading) {
    return <div className="text-center text-text-secondary">Loading search results...</div>;
  }

  if (errorMsg) {
    return <div className="text-center text-accent-error">{errorMsg}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-6 shrink-0">
        <div className="bg-card p-6 rounded-xl border border-border-light shadow-sm space-y-6">
          <h3 className="font-bold text-lg mb-4 text-text-primary">Filters</h3>
          
          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 rounded-lg border border-border-light bg-hover text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Any</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Price Range (LKR)</label>
            <div className="flex gap-2">
                <input 
                    type="number" 
                    placeholder="Min" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border-light bg-hover text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border-light bg-hover text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
            </div>
          </div>

          {/* Beds & Baths */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Bedrooms</label>
            <div className="flex flex-wrap gap-2">
                {['Any', '1', '2', '3', '4+'].map(opt => (
                    <button
                        key={opt}
                        onClick={() => setBeds(opt === 'Any' ? '' : opt)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            (beds === opt || (opt === 'Any' && beds === '')) 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-transparent text-text-secondary border-border-light hover:border-primary'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
          </div>
           <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Bathrooms</label>
            <div className="flex flex-wrap gap-2">
                {['Any', '1', '2', '3', '4+'].map(opt => (
                    <button
                        key={opt}
                        onClick={() => setBaths(opt === 'Any' ? '' : opt)}
                         className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            (baths === opt || (opt === 'Any' && baths === '')) 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-transparent text-text-secondary border-border-light hover:border-primary'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Size (Sqft)</label>
             <div className="flex gap-2">
                <input 
                    type="number" 
                    placeholder="Min" 
                    value={minSize}
                    onChange={(e) => setMinSize(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border-light bg-hover text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxSize}
                    onChange={(e) => setMaxSize(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border-light bg-hover text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
            <p className="text-text-secondary">{properties.length} Properties found</p>
            <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="p-2 rounded-lg border border-border-light bg-white text-text-primary focus:outline-none"
            >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
            </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <p className="text-text-secondary md:col-span-2 text-center py-20">
              No properties found matching your criteria. Try adjusting your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrap the component in Suspense as required by Next.js when using useSearchParams
export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-text-primary">Search Results</h1>
        <Suspense fallback={<div className="text-center text-text-secondary">Loading...</div>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}