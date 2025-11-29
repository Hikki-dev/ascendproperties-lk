import { supabase } from '@/lib/supabase/client';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { notFound } from 'next/navigation';
import { Property } from '@/types/property';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !property) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-8">Edit Property</h1>
      <PropertyForm initialData={property as Property} isEdit />
    </div>
  );
}
