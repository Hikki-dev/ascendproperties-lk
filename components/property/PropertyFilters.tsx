"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    type: searchParams.get('type') || 'all',
    status: searchParams.get('status') || 'all',
    price: searchParams.get('price') || 'all',
    bedrooms: searchParams.get('bedrooms') || 'all',
  });

  // Update local state when URL params change
  useEffect(() => {
    setFilters({
      q: searchParams.get('q') || '',
      type: searchParams.get('type') || 'all',
      status: searchParams.get('status') || 'all',
      price: searchParams.get('price') || 'all',
      bedrooms: searchParams.get('bedrooms') || 'all',
    });
  }, [searchParams]);

  const updateFilters = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    if (newFilters.q) params.set('q', newFilters.q);
    if (newFilters.type !== 'all') params.set('type', newFilters.type);
    if (newFilters.status !== 'all') params.set('status', newFilters.status);
    if (newFilters.price !== 'all') params.set('price', newFilters.price);
    if (newFilters.bedrooms !== 'all') params.set('bedrooms', newFilters.bedrooms);
    
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border-light p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-lg text-text-primary">Filters</h2>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Location, keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none text-text-primary"
              value={filters.q}
              onChange={(e) => updateFilters('q', e.target.value)}
            />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">Property Type</label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none text-text-primary bg-white"
            value={filters.type}
            onChange={(e) => updateFilters('type', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Land">Land</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">Status</label>
          <div className="flex gap-2">
            <Button
              variant={filters.status === 'sale' ? 'primary' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => updateFilters('status', filters.status === 'sale' ? 'all' : 'sale')}
            >
              For Sale
            </Button>
            <Button
              variant={filters.status === 'rent' ? 'primary' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => updateFilters('status', filters.status === 'rent' ? 'all' : 'rent')}
            >
              For Rent
            </Button>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">Price Range</label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none text-text-primary bg-white"
            value={filters.price}
            onChange={(e) => updateFilters('price', e.target.value)}
          >
            <option value="all">Any Price</option>
            <option value="0-25m">Up to 25M</option>
            <option value="25m-50m">25M - 50M</option>
            <option value="50m-100m">50M - 100M</option>
            <option value="100m+">100M+</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">Bedrooms</label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none text-text-primary bg-white"
            value={filters.bedrooms}
            onChange={(e) => updateFilters('bedrooms', e.target.value)}
          >
            <option value="all">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <Button 
          variant="ghost" 
          className="w-full text-text-secondary hover:text-primary"
          onClick={() => {
            setFilters({ q: '', type: 'all', status: 'all', price: 'all', bedrooms: 'all' });
            router.push('/properties');
          }}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
