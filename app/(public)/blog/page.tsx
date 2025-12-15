
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-12 text-center">Latest News & Insights</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={post.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border-light hover:-translate-y-1 block"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image_url || 'https://placehold.co/600x400/F1F3F6/6E6E6E?text=Blog+Image'}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.published_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author || 'Admin'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-text-secondary line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="text-primary font-semibold text-sm">Read More →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
