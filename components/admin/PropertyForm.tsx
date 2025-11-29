"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { Property } from '@/types/property';
import { propertySchema } from '@/lib/validations';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { 
  Type, 
  Link as LinkIcon, 
  DollarSign, 
  FileText, 
  Home, 
  BedDouble, 
  Bath, 
  Ruler, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

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
      
      console.error('Validation errors:', fieldErrors);
      setErrors(fieldErrors);
      setLoading(false);
      alert('Please fix the validation errors shown in the form.');
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
      // Detailed error logging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      // @ts-ignore
      if (error?.message) alert(`Error saving property: ${error.message}`);
      else alert('Error saving property. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Basic Information Section */}
      <div className="bg-card p-8 rounded-2xl shadow-sm border border-border-light space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-border-light">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Basic Information</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary flex items-center gap-2">
              Title <span className="text-accent-error">*</span>
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.title ? 'border-accent-error' : 'border-border-light'} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary bg-white`}
                placeholder="e.g. Luxury Villa in Colombo 7"
                required
              />
            </div>
            {errors.title && <p className="text-sm text-accent-error mt-1">{errors.title}</p>}
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary flex items-center gap-2">
              Slug (URL)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary bg-white"
                placeholder="Auto-generated from title"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary flex items-center gap-2">
              Price (LKR) <span className="text-accent-error">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.price ? 'border-accent-error' : 'border-border-light'} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary bg-white`}
                required
              />
            </div>
            {errors.price && <p className="text-sm text-accent-error mt-1">{errors.price}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary flex items-center gap-2">
              Status
            </label>
            <div className="relative">
              <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary bg-white appearance-none cursor-pointer"
              >
                <option value="sale" className="text-text-primary">For Sale</option>
                <option value="rent" className="text-text-primary">For Rent</option>
                <option value="both" className="text-text-primary">Both (Sale & Rent)</option>
                <option value="sold" className="text-text-primary">Sold</option>
                <option value="off_market" className="text-text-primary">Off Market</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-text-primary">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary bg-white resize-none"
            placeholder="Describe the property..."
          />
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-card p-8 rounded-2xl shadow-sm border border-border-light space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border-light">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Home className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Property Images</h2>
        </div>
        <ImageUpload 
          value={formData.photos} 
          onChange={(urls) => setFormData(prev => ({ ...prev, photos: urls }))}
          disabled={loading}
        />
      </div>

      {/* Property Details Section */}
      <div className="bg-card p-8 rounded-2xl shadow-sm border border-border-light space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-border-light">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Home className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Property Details</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary">Type</label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary bg-white appearance-none cursor-pointer"
              >
                <option value="House" className="text-text-primary">House</option>
                <option value="Apartment" className="text-text-primary">Apartment</option>
                <option value="Land" className="text-text-primary">Land</option>
                <option value="Commercial" className="text-text-primary">Commercial</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary">Bedrooms</label>
            <div className="relative">
              <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary bg-white"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary">Bathrooms</label>
            <div className="relative">
              <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary bg-white"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary">Size (Sq. Ft)</label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="number"
                name="size_sqft"
                value={formData.size_sqft}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary bg-white"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary">City <span className="text-accent-error">*</span></label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                name="location_city"
                value={formData.location_city}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.location_city ? 'border-accent-error' : 'border-border-light'} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary bg-white`}
                required
              />
            </div>
            {errors.location_city && <p className="text-sm text-accent-error mt-1">{errors.location_city}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-text-primary">District <span className="text-accent-error">*</span></label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                name="location_district"
                value={formData.location_district}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.location_district ? 'border-accent-error' : 'border-border-light'} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary bg-white`}
                required
              />
            </div>
            {errors.location_district && <p className="text-sm text-accent-error mt-1">{errors.location_district}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4 border-t border-border-light">
          <input
            type="checkbox"
            id="is_featured"
            name="is_featured"
            checked={formData.is_featured}
            onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
            className="w-5 h-5 text-primary border-border-light rounded focus:ring-primary cursor-pointer"
          />
          <label htmlFor="is_featured" className="text-base font-medium text-text-primary cursor-pointer select-none">Mark as Featured Property</label>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 pt-4">
        <Button type="submit" variant="primary" size="lg" className="px-8" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
