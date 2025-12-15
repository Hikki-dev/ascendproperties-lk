
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { upsertPost } from '@/app/actions/admin';
// import { supabase } from '@/lib/supabase/client'; // Removed direct client usage
import { ImageUpload } from '@/components/admin/ImageUpload';
import { FileText, Link as LinkIcon, Calendar, User } from 'lucide-react';

interface PostFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function PostForm({ initialData, isEdit = false }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    image_url: initialData?.image_url ? [initialData.image_url] : [], // Adapter for ImageUpload which expects array
    published: initialData?.published || false,
    author: initialData?.author || '',
    published_at: initialData?.published_at || new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        image_url: formData.image_url[0] || null, // Convert back to single string
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      };

      if (isEdit && initialData?.id) {
        const result = await upsertPost(dataToSubmit, initialData.id);
        if (result.error) throw new Error(result.error);
      } else {
        const result = await upsertPost(dataToSubmit);
        if (result.error) throw new Error(result.error);
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="bg-card p-8 rounded-2xl shadow-sm border border-border-light space-y-6">
        
        <div className="space-y-3">
          <label className="text-sm font-bold text-text-primary">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Post Title"
            required
          />
        </div>

        <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary">Slug</label>
            <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="url-slug"
            />
        </div>

        <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary">Excerpt</label>
            <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                placeholder="Short summary for the list view..."
            />
        </div>

        <div className="space-y-3">
             <label className="text-sm font-bold text-text-primary">Content (HTML allowed)</label>
             <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={15}
                className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                placeholder="<p>Write your content here...</p>"
            />
            <p className="text-xs text-text-secondary">Basic HTML tags supported for now.</p>
        </div>

        <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary">Featured Image</label>
            <ImageUpload 
                value={formData.image_url} 
                onChange={(urls) => setFormData(prev => ({ ...prev, image_url: urls }))} 
                bucket="blog"
                maxFiles={1}
            />
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
                <label className="text-sm font-bold text-text-primary">Author</label>
                <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Author Name"
                />
            </div>
            
             <div className="space-y-3">
                <label className="text-sm font-bold text-text-primary">Publish Date</label>
                <input
                    type="date"
                    name="published_at"
                    value={formData.published_at}
                    // @ts-ignore
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
            </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4 border-t border-border-light">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
            className="w-5 h-5 text-primary border-border-light rounded focus:ring-primary cursor-pointer"
          />
          <label htmlFor="published" className="text-base font-medium text-text-primary cursor-pointer select-none">Publish this post</label>
        </div>

      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" size="lg" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
