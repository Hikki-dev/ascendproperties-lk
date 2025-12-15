
import { supabase } from '@/lib/supabase/client';
import { PostForm } from '@/components/admin/PostForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-8">Edit Post</h1>
      <PostForm initialData={post} isEdit />
    </div>
  );
}
