'use server';

import { createClient } from '@/lib/supabase/server';

export async function getLocations(query: string) {
  if (!query || query.length < 2) return [];

  const supabase = await createClient();
  
  // Fetch distinct locations that match the query
  const { data, error } = await supabase
    .from('properties')
    .select('location_city')
    .ilike('location_city', `%${query}%`)
    .limit(10); // Limit results

  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }

  // Deduplicate results
  const uniqueLocations = Array.from(new Set(data.map(item => item.location_city)));
  
  return uniqueLocations;
}
