"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { getLocations } from '@/actions/getLocations';
import { useRouter } from 'next/navigation';

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
    if (priceRange !== 'all') params.set('price', priceRange);
    params.set('mode', activeTab);
    if (activeTab === 'buy') params.set('status', 'sale');
    if (activeTab === 'rent') params.set('status', 'rent');
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl animate-fade-in-up relative z-50" style={{ animationDelay: '0.4s' }}>
      {/* Tabs */}
      <div className="flex gap-0 mb-0">
        {(['buy', 'rent'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-500 ${
              activeTab === tab
                ? 'bg-black/60 backdrop-blur-xl text-primary border-b-2 border-primary'
                : 'bg-black/30 backdrop-blur-md text-white/60 hover:text-white/80 border-b-2 border-transparent'
            }`}
          >
            {tab === 'buy' ? 'Purchase' : 'Lease'}
          </button>
        ))}
      </div>

      {/* Main Search Box */}
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 p-4 md:p-5 flex flex-col md:flex-row gap-3 relative">

        {/* Location Input with Autocomplete */}
        <div className="flex-1 relative" ref={wrapperRef}>
          <div className="flex items-center px-4 h-14 bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300 focus-within:border-primary/60 group">
            <Search className="w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by location, neighborhood..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 font-light ml-3 text-sm tracking-wide"
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
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary/60" />}
          </div>

          {/* Dropdown Suggestions */}
          {isOpen && (
            <div className="absolute top-16 left-0 right-0 bg-dark-light/95 backdrop-blur-xl border border-white/10 mt-1 p-2 z-[100] max-h-[300px] overflow-y-auto">
              <div className="text-[10px] font-medium text-primary/60 px-3 py-2 uppercase tracking-ultra-wide">Locations</div>
              {suggestions.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center px-3 py-3 hover:bg-white/5 cursor-pointer text-white/80 transition-colors text-sm"
                  onClick={() => {
                    setSearchQuery(location);
                    setIsOpen(false);
                  }}
                >
                  <MapPin className="w-3.5 h-3.5 text-primary mr-3" />
                  <span className="font-light tracking-wide">{location}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:block w-px bg-white/10" />

        {/* Property Type Dropdown */}
        <div className="md:w-44 relative">
          <select
            className="w-full h-14 px-4 bg-white/5 border border-white/10 text-white/80 font-light text-sm tracking-wide outline-none cursor-pointer appearance-none transition-all duration-300 hover:border-primary/30 focus:border-primary/60"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="all" className="bg-dark-light">All Types</option>
            <option value="House" className="bg-dark-light">House</option>
            <option value="Apartment" className="bg-dark-light">Apartment</option>
            <option value="Land" className="bg-dark-light">Land</option>
            <option value="Commercial" className="bg-dark-light">Commercial</option>
          </select>
        </div>

        <div className="hidden md:block w-px bg-white/10" />

        {/* Price Dropdown */}
        <div className="md:w-44 relative">
          <select
            className="w-full h-14 px-4 bg-white/5 border border-white/10 text-white/80 font-light text-sm tracking-wide outline-none cursor-pointer appearance-none transition-all duration-300 hover:border-primary/30 focus:border-primary/60"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="all" className="bg-dark-light">Any Price</option>
            <option value="0-25000000" className="bg-dark-light">Up to $250K</option>
            <option value="25000000-50000000" className="bg-dark-light">$250K - $500K</option>
            <option value="50000000-100000000" className="bg-dark-light">$500K - $1M</option>
            <option value="100000000+" className="bg-dark-light">$1M+</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="h-14 px-10 bg-primary hover:bg-primary-dark text-dark font-semibold tracking-widest uppercase text-xs transition-all duration-500 hover:shadow-[0_0_30px_rgba(198,169,98,0.3)] flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </div>
  );
};
