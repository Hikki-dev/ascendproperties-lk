
import { supabase } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getPost(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <article className="max-w-4xl mx-auto px-4">
        <Link href="/blog" className="inline-flex items-center text-text-secondary hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-text-secondary mb-8 pb-8 border-b border-border-light">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {new Date(post.published_at).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {post.author || 'Ascend Team'}
          </span>
        </div>

        <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden mb-12 shadow-lg">
          <Image
            src={post.image_url || 'https://placehold.co/1200x600/F1F3F6/6E6E6E?text=Blog+Image'}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div 
          className="prose prose-lg max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>
    </div>
  );
}
