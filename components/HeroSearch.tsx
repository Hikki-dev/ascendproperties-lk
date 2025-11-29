"use client";

import React, { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Removed this line
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSearch = () => {
  // const router = useRouter(); // Removed this line
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (propertyType !== 'all') params.set('type', propertyType);
    if (priceRange !== 'all') params.set('price', priceRange);

    // Navigate to the /search page with the query
    // This uses the browser's built-in navigation
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="bg-card rounded-2xl shadow-2xl p-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-hover rounded-xl">
          <Search className="w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by location, property type..."
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-text-placeholder"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select 
          className="px-4 py-3 bg-hover rounded-xl text-text-primary border-none outline-none cursor-pointer"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="all">All Types</option>
          {/* These should match your 'property_type' enum */}
          <option value="House">House</option>
          <option value="Apartment">Apartment</option>
          <option value="Land">Land</option>
          <option value="Commercial">Commercial</option>
        </select>

        <select 
          className="px-4 py-3 bg-hover rounded-xl text-text-primary border-none outline-none cursor-pointer"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="all">Any Price</option>
          <option value="0-25m">Up to 25M</option>
          <option value="25m-50m">25M - 50M</option>
          <option value="50m-100m">50M - 100M</option>
          <option value="100m+">100M+</option>
        </select>

        <Button 
          onClick={handleSearch}
          variant="primary"
          className="px-8 py-3 h-auto text-base"
        >
          <Search className="w-5 h-5 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};