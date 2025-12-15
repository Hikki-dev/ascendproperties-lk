
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data;
}

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Blog Posts</h1>
        <Button asChild variant="primary">
          <Link href="/admin/blog/new">
            <Plus className="w-5 h-5 mr-2" />
            Add New Post
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ui-soft border-b border-border-light">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">Post</th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-bold text-text-primary">Wait/Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">Date</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-hover transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 border border-border-light flex-shrink-0">
                        <Image
                          src={post.image_url || 'https://placehold.co/100x100/F1F3F6/6E6E6E?text=No+Image'}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text-primary line-clamp-1">{post.title}</p>
                        <p className="text-sm text-text-secondary truncate">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-text-primary hover:text-primary hover:bg-primary/10">
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      {/* Delete logic would be needed here, keeping it simple for now */}
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-accent-error hover:bg-accent-error/10">
                          <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-secondary">
                        No blog posts found. Create your first one!
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
