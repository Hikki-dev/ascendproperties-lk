import { Suspense } from 'react';
import { supabase } from '@/lib/supabase/client';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Property } from '@/types/property';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

async function getProperties(searchParams: { [key: string]: string | string[] | undefined }) {
  let query = supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters
  const q = searchParams.q as string;
  const type = searchParams.type as string;
  const status = searchParams.status as string;
  const price = searchParams.price as string;
  const bedrooms = searchParams.bedrooms as string;

  if (q) {
    query = query.or(`title.ilike.%${q}%,location_city.ilike.%${q}%`);
  }

  if (type && type !== 'all') {
    query = query.eq('property_type', type);
  }

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (bedrooms && bedrooms !== 'all') {
    query = query.gte('bedrooms', parseInt(bedrooms));
  }

  if (price && price !== 'all') {
    if (price === '0-25m') {
      query = query.lte('price', 25000000);
    } else if (price === '25m-50m') {
      query = query.gte('price', 25000000).lte('price', 50000000);
    } else if (price === '50m-100m') {
      query = query.gte('price', 50000000).lte('price', 100000000);
    } else if (price === '100m+') {
      query = query.gte('price', 100000000);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  return data as Property[];
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const properties = await getProperties(params);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Properties for Sale & Rent
          </h1>
          <p className="text-text-secondary">
            {properties.length} properties found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div>Loading filters...</div>}>
              <PropertyFilters />
            </Suspense>
          </div>

          {/* Property Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div>Loading properties...</div>}>
              <PropertyGrid properties={properties} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
