import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';

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
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary">Property</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-hover transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={property.photos?.[0] || 'https://placehold.co/100x100/F1F3F6/6E6E6E?text=No+Image'}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary line-clamp-1">{property.title}</p>
                        <p className="text-sm text-text-secondary">{property.location_city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-primary">{property.property_type}</td>
                  <td className="px-6 py-4 text-text-primary">
                    LKR {(property.price / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      property.status === 'sale' ? 'bg-blue-100 text-blue-700' :
                      property.status === 'rent' ? 'bg-green-100 text-green-700' :
                      property.status === 'sold' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {property.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/property/${property.slug}`} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/admin/properties/${property.id}/edit`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-accent-error hover:text-accent-error hover:bg-accent-error/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
