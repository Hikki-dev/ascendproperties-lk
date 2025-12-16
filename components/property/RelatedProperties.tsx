import { createClient } from '@/lib/supabase/server';
import { Property } from '@/types/property';
import { PropertyCard } from '@/components/PropertyCard';

interface RelatedPropertiesProps {
  currentPropertyId: string;
  type: string;
  city: string;
}

async function getRelatedProperties(currentId: string, type: string, city: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .neq('id', currentId)
    .eq('property_type', type)
    .limit(3);

  if (error) {
    console.error('Error fetching related properties:', error);
    return [];
  }

  return data as Property[];
}

export async function RelatedProperties({ currentPropertyId, type, city }: RelatedPropertiesProps) {
  const relatedProperties = await getRelatedProperties(currentPropertyId, type, city);

  if (relatedProperties.length === 0) return null;

  return (
    <section className="py-12 border-t border-border-light mt-12">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Similar Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
