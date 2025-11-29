import { Property } from '@/types/property';
import { PropertyCard } from '@/components/PropertyCard';

interface PropertyGridProps {
  properties: Property[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20 bg-ui-soft rounded-2xl">
        <h3 className="text-xl font-bold text-text-primary mb-2">No properties found</h3>
        <p className="text-text-secondary">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
