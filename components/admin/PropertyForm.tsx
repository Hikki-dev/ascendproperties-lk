"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { Property } from '@/types/property';
import { propertySchema } from '@/lib/validations';

interface PropertyFormProps {
  initialData?: Partial<Property>;
  isEdit?: boolean;
}

export function PropertyForm({ initialData, isEdit = false }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    property_type: initialData?.property_type || 'House',
    status: initialData?.status || 'sale',
    price: initialData?.price || 0,
    location_city: initialData?.location_city || '',
    location_district: initialData?.location_district || '',
    bedrooms: initialData?.bedrooms || 0,
    bathrooms: initialData?.bathrooms || 0,
    size_sqft: initialData?.size_sqft || 0,
    photos: initialData?.photos || [],
    is_featured: initialData?.is_featured || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate with Zod
    const result = propertySchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      const fieldErrors: Record<string, string> = {};
      
      // Convert array of strings to single string for our simple error state
      Object.entries(formattedErrors).forEach(([key, value]) => {
        if (value && value.length > 0) {
          fieldErrors[key] = value[0];
        }
      });
      
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        // Ensure slug is URL friendly if not provided
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      };

      if (isEdit && initialData?.id) {
        const { error } = await supabase
          .from('properties')
          .update(dataToSubmit)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([dataToSubmit]);
        if (error) throw error;
      }

      router.push('/admin/properties');
      router.refresh();
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="bg-card p-6 rounded-xl shadow-sm border border-border-light space-y-6">
        <h2 className="text-xl font-bold text-text-primary">Basic Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Slug (URL)</label>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none"
              placeholder="Auto-generated from title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Price (LKR)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none bg-white"
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="both">Both (Sale & Rent)</option>
              <option value="sold">Sold</option>
              <option value="off_market">Off Market</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none"
          />
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm border border-border-light space-y-6">
        <h2 className="text-xl font-bold text-text-primary">Property Details</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Type</label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none bg-white"
            >
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Land">Land</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Size (Sq. Ft)</label>
            <input
              type="number"
              name="size_sqft"
              value={formData.size_sqft}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">City</label>
            <input
              name="location_city"
              value={formData.location_city}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">District</label>
            <input
              name="location_district"
              value={formData.location_district}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light focus:border-primary outline-none"
              required
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_featured"
            name="is_featured"
            checked={formData.is_featured}
            onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
            className="w-4 h-4 text-primary border-border-light rounded focus:ring-primary"
          />
          <label htmlFor="is_featured" className="text-sm font-medium text-text-primary">Mark as Featured Property</label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
