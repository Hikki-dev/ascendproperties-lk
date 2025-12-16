"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command } from 'cmdk';
import { getLocations } from '@/actions/getLocations';
import { useRouter } from 'next/navigation';

// I won't assume use-debounce is installed. I'll implement a simple debounce hook or use timeout.
function useDebounceValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export const HeroSearch = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounceValue(searchQuery, 300);

  useEffect(() => {
    const fetchLocations = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const locations = await getLocations(debouncedQuery);
        setSuggestions(locations);
        setIsOpen(locations.length > 0);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (propertyType !== 'all') params.set('type', propertyType);
    
    // Adjust price logic or pass raw range. Currently assuming query param 'price' handles string.
    if (priceRange !== 'all') params.set('price', priceRange);
    
    // Add tab filter
    params.set('mode', activeTab); // buy or rent
    
    // Default to 'sale' if in buy mode, 'rent' if in rent mode for the status filter
    if (activeTab === 'buy') params.set('status', 'sale');
    if (activeTab === 'rent') params.set('status', 'rent');

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up relative z-50" style={{ animationDelay: '0.2s' }}>
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('buy')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
            activeTab === 'buy' 
              ? 'bg-primary text-white shadow-lg scale-105' 
              : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setActiveTab('rent')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
            activeTab === 'rent' 
              ? 'bg-primary text-white shadow-lg scale-105' 
              : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
          }`}
        >
          Rent
        </button>
      </div>

      {/* Main Search Box */}
      <div className="bg-white rounded-3xl p-3 shadow-2xl flex flex-col md:flex-row gap-2 relative">
        
        {/* Location Input with Autocomplete */}
        <div className="flex-1 relative" ref={wrapperRef}>
           <div className="flex items-center px-4 h-14 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors border border-transparent focus-within:border-primary/20 focus-within:bg-white focus-within:shadow-sm group">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search City, Neighborhood..."
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 font-medium ml-3"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length < 2) setIsOpen(false);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setIsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                   handleSearch();
                   setIsOpen(false);
                }
              }}
            />
             {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
           </div>

           {/* Dropdown Suggestions */}
           {isOpen && (
             <div className="absolute top-16 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 mt-2 p-2 z-[100] max-h-[300px] overflow-y-auto">
                <div className="text-xs font-bold text-gray-400 px-3 py-2 uppercase tracking-wider sticky top-0 bg-white">Locations</div>
                {suggestions.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-3 hover:bg-blue-50/50 rounded-xl cursor-pointer text-gray-700 transition-colors"
                    onClick={() => {
                      setSearchQuery(location);
                      setIsOpen(false);
                    }}
                  >
                    <MapPin className="w-4 h-4 text-primary mr-3 bg-blue-100 p-0.5 rounded-full box-content" />
                    <span className="font-medium">{location}</span>
                  </div>
                ))}
             </div>
           )}
        </div>

        <div className="h-px md:h-auto md:w-px bg-gray-200 mx-1" />

        {/* Property Type Dropdown */}
        <div className="md:w-48 relative group">
          <select 
            className="w-full h-14 px-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-700 font-medium border-r-[16px] border-transparent outline-none cursor-pointer appearance-none transition-colors focus:bg-white focus:shadow-sm"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Land">Land</option>
            <option value="Commercial">Commercial</option>
          </select>
           {/* Custom arrow could go here if appearance-none is used, but relying on browser default for now or I can add a chevron icon absolutely positioned */}
        </div>

        <div className="h-px md:h-auto md:w-px bg-gray-200 mx-1" />

        {/* Price Dropdown */}
        <div className="md:w-48 relative">
           <select 
            className="w-full h-14 px-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-700 font-medium border-r-[16px] border-transparent outline-none cursor-pointer appearance-none transition-colors focus:bg-white focus:shadow-sm"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="all">Any Price</option>
             <option value="0-25000000">Up to 25M</option>
             <option value="25000000-50000000">25M - 50M</option>
             <option value="50000000-100000000">50M - 100M</option>
             <option value="100000000+">100M+</option>
          </select>
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
        >
          <Search className="w-5 h-5 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};