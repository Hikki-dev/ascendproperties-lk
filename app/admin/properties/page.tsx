import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Eye } from 'lucide-react';
import Image from 'next/image';
import { DeletePropertyButton } from '@/components/admin/DeletePropertyButton';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
  return data;
}

export default async function AdminPropertiesPage() {
  const properties = await getProperties();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Properties</h1>
        <Button asChild variant="primary">
          <Link href="/admin/properties/new">
            <Plus className="w-5 h-5 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ui-soft border-b border-border-light">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">Property</th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-bold text-text-primary">Type</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">Price</th>
                <th className="hidden lg:table-cell px-6 py-4 text-left text-sm font-bold text-text-primary">Status</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-hover transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 border border-border-light flex-shrink-0">
                        <Image
                          src={property.photos?.[0] || 'https://placehold.co/100x100/F1F3F6/6E6E6E?text=No+Image'}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text-primary line-clamp-1">{property.title}</p>
                        <p className="text-sm text-text-primary font-medium truncate">{property.location_city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-text-primary font-medium">{property.property_type}</td>
                  <td className="px-6 py-4 text-text-primary font-bold whitespace-nowrap">
                    LKR {(property.price / 1000000).toFixed(1)}M
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      property.status === 'sale' ? 'bg-blue-100 text-blue-800' :
                      property.status === 'rent' ? 'bg-green-100 text-green-800' :
                      property.status === 'sold' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-text-primary hover:text-primary hover:bg-primary/10">
                        <Link href={`/property/${property.slug}`} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-text-primary hover:text-primary hover:bg-primary/10">
                        <Link href={`/admin/properties/${property.id}/edit`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <DeletePropertyButton id={property.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
