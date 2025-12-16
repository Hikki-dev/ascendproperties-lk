"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase/client';
import { PropertyCard } from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import type { Property } from '@/types/property'; // Import your main Property type

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Local state for filters (initially from URL)
  // Price is handled in Millions for user input, so we convert from/to URL values (which are raw numbers)
  const initialMinPrice = searchParams.get('minPrice') ? (parseInt(searchParams.get('minPrice')!) / 1000000).toString() : '';
  const initialMaxPrice = searchParams.get('maxPrice') ? (parseInt(searchParams.get('maxPrice')!) / 1000000).toString() : '';

  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [beds, setBeds] = useState(searchParams.get('beds') || '');
  const [baths, setBaths] = useState(searchParams.get('baths') || '');
  const [minSize, setMinSize] = useState(searchParams.get('minSize') || '');
  const [maxSize, setMaxSize] = useState(searchParams.get('maxSize') || '');
  const [status, setStatus] = useState(searchParams.get('status') || ''); 
  // Sort is now handled directly via URL for instant feedback

  const q = searchParams.get('q');
  const type = searchParams.get('type');
  
  // NOTE: 'price' param from HeroSearch might be existing (e.g. "0-25000000"), we should respect it if valid, 
  // but the sidebar filters override specific min/max.

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setErrorMsg('');
      
      let query = supabase
        .from('properties')
        .select('*'); // Select all for now to be safe

      // 1. Full-Text Search
      if (q) {
        const ftsQuery = q.trim().split(' ').join(' & ');
        query = query.textSearch('fts', ftsQuery);
      }
      
      // 2. Property Type
      if (type && type !== 'all') {
        query = query.eq('property_type', type);
      }
      
      // 3. Price Range (from URL params)
      const urlMinPrice = searchParams.get('minPrice');
      const urlMaxPrice = searchParams.get('maxPrice');
      const urlPriceRange = searchParams.get('price'); // fallback for HeroSearch dropdown

      if (urlMinPrice) query = query.gte('price', parseInt(urlMinPrice));
      if (urlMaxPrice) query = query.lte('price', parseInt(urlMaxPrice));
      
      // Handle the range string from HeroSearch if manual min/max aren't set
      if (!urlMinPrice && !urlMaxPrice && urlPriceRange && urlPriceRange !== 'all') {
         if (urlPriceRange.includes('+')) {
             const min = parseInt(urlPriceRange.replace('+', ''));
             query = query.gte('price', min);
         } else {
             const [min, max] = urlPriceRange.split('-').map(Number);
             query = query.gte('price', min).lte('price', max);
         }
      }

      // 4. Beds & Baths
      const urlBeds = searchParams.get('beds');
      if (urlBeds && urlBeds !== 'any') {
        if (urlBeds === '4+') query = query.gte('bedrooms', 4);
        else query = query.eq('bedrooms', parseInt(urlBeds));
      }
      
      const urlBaths = searchParams.get('baths');
      if (urlBaths && urlBaths !== 'any') {
         if (urlBaths === '4+') query = query.gte('bathrooms', 4);
         else query = query.eq('bathrooms', parseInt(urlBaths));
      }

      // 5. Size
      const urlMinSize = searchParams.get('minSize');
      const urlMaxSize = searchParams.get('maxSize');
      if (urlMinSize) query = query.gte('size_sqft', parseInt(urlMinSize));
      if (urlMaxSize) query = query.lte('size_sqft', parseInt(urlMaxSize));

      // 6. Status & Sort
      const urlStatus = searchParams.get('status');
      if (urlStatus && urlStatus !== 'all') {
        query = query.eq('status', urlStatus);
      } else {
        query = query.in('status', ['sale', 'rent']);
      }

      const urlSort = searchParams.get('sort') || 'newest';
      if (urlSort === 'newest') query = query.order('created_at', { ascending: false });
      if (urlSort === 'price-asc') query = query.order('price', { ascending: true });
      if (urlSort === 'price-desc') query = query.order('price', { ascending: false });

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
  }, [searchParams]); // Depend only on URL SearchParams

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Status
    if (status) params.set('status', status);
    else params.delete('status');

    // Price (Convert Millions to Absolute)
    if (minPrice) params.set('minPrice', (parseFloat(minPrice) * 1000000).toString());
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', (parseFloat(maxPrice) * 1000000).toString());
    else params.delete('maxPrice');

    // Remove the generic 'price' param if manual filters are applied to avoid conflict
    if (minPrice || maxPrice) params.delete('price');

    // Beds
    if (beds) params.set('beds', beds);
    else params.delete('beds');

    // Baths
    if (baths) params.set('baths', baths);
    else params.delete('baths');
    
    // Size
    if (minSize) params.set('minSize', minSize);
    else params.delete('minSize');

    if (maxSize) params.set('maxSize', maxSize);
    else params.delete('maxSize');
    
    // Sort is preserved because we start with searchParams.toString()

    router.push(`/search?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    router.push(`/search?${params.toString()}`);
  };

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
            <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-text-secondary">Price Range</label>
                <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">Millions (LKR)</span>
            </div>
            <div className="flex gap-2 items-center">
                <input 
                    type="number" 
                    placeholder="Min (M)" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border-light bg-hover text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <span className="text-gray-400">-</span>
                <input 
                    type="number" 
                    placeholder="Max (M)" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border-light bg-hover text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
            </div>
            <p className="text-xs text-text-secondary text-center">
                Example: Type <strong>32</strong> for 32 Million
            </p>
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
          
          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>

        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
            <p className="text-text-secondary">{properties.length} Properties found</p>
            <select 
                value={searchParams.get('sort') || 'newest'} 
                onChange={handleSortChange}
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