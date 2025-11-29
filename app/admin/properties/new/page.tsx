import { PropertyForm } from '@/components/admin/PropertyForm';

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-8">Add New Property</h1>
      <PropertyForm />
    </div>
  );
}
