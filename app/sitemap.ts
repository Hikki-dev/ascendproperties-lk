import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase/client' // Or server client if you prefer, but client is faster for build sometimes if configured right, or use fetch

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ascendproperties.lk'

  // Get Properties
  const { data: properties } = await supabase
    .from('properties')
    .select('slug, updated_at')
    .eq('status', 'sale') // Or both sale and rent 
    .in('status', ['sale', 'rent']);

  const propertyUrls = (properties || []).map((property) => ({
    url: `${baseUrl}/property/${property.slug}`,
    lastModified: new Date(property.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Get Blog Posts
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('published', true);

  const postUrls = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...propertyUrls,
    ...postUrls,
  ]
}
