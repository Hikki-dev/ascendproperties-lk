"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addProperty } from "./actions";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-gray-400"
    >
      {pending ? "Saving Property..." : "Save Property"}
    </button>
  );
}

export default function AddPropertyPage() {
  const [state, formAction] = useFormState(addProperty, initialState);

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Add New Property</h1>
      
      <form action={formAction} className="bg-card p-8 rounded-2xl border border-border-light space-y-6">
        
        {/* Status Messages */}
        {state.message && (
          <div className={`p-4 rounded-lg ${
            state.success ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-error/20 text-accent-error'
          }`}>
            {state.message}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-medium text-text-primary mb-2">Title</label>
            <input type="text" name="title" id="title" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" />
            {state.errors?.title && <p className="text-accent-error text-sm mt-1">{state.errors.title[0]}</p>}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block font-medium text-text-primary mb-2">URL Slug (e.g., "luxury-villa-colombo-7")</label>
            <input type="text" name="slug" id="slug" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" />
            {state.errors?.slug && <p className="text-accent-error text-sm mt-1">{state.errors.slug[0]}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Property Type */}
          <div>
            <label htmlFor="property_type" className="block font-medium text-text-primary mb-2">Property Type</label>
            <select name="property_type" id="property_type" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background">
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
            {state.errors?.property_type && <p className="text-accent-error text-sm mt-1">{state.errors.property_type[0]}</p>}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block font-medium text-text-primary mb-2">Listing Status</label>
            <select name="status" id="status" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background">
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
            {state.errors?.status && <p className="text-accent-error text-sm mt-1">{state.errors.status[0]}</p>}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block font-medium text-text-primary mb-2">Price (in LKR)</label>
            <input type="number" name="price" id="price" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" />
            {state.errors?.price && <p className="text-accent-error text-sm mt-1">{state.errors.price[0]}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Location District */}
          <div>
            <label htmlFor="location_district" className="block font-medium text-text-primary mb-2">District (e.g., "Colombo")</label>
            <input type="text" name="location_district" id="location_district" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" />
            {state.errors?.location_district && <p className="text-accent-error text-sm mt-1">{state.errors.location_district[0]}</p>}
          </div>

          {/* Location City */}
          <div>
            <label htmlFor="location_city" className="block font-medium text-text-primary mb-2">City (e.g., "Colombo 7")</label>
            <input type="text" name="location_city" id="location_city" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" />
            {state.errors?.location_city && <p className="text-accent-error text-sm mt-1">{state.errors.location_city[0]}</p>}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block font-medium text-text-primary mb-2">Full Address (Optional)</label>
            <input type="text" name="address" id="address" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bedrooms */}
          <div>
            <label htmlFor="bedrooms" className="block font-medium text-text-primary mb-2">Bedrooms</label>
            <input type="number" name="bedrooms" id="bedrooms" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" />
            {state.errors?.bedrooms && <p className="text-accent-error text-sm mt-1">{state.errors.bedrooms[0]}</p>}
          </div>

          {/* Bathrooms */}
          <div>
            <label htmlFor="bathrooms" className="block font-medium text-text-primary mb-2">Bathrooms</label>
            <input type="number" name="bathrooms" id="bathrooms" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" />
            {state.errors?.bathrooms && <p className="text-accent-error text-sm mt-1">{state.errors.bathrooms[0]}</p>}
          </div>

          {/* Size (sqft) */}
          <div>
            <label htmlFor="size_sqft" className="block font-medium text-text-primary mb-2">Size (sqft)</label>
            <input type="number" name="size_sqft" id="size_sqft" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" />
            {state.errors?.size_sqft && <p className="text-accent-error text-sm mt-1">{state.errors.size_sqft[0]}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium text-text-primary mb-2">Description</label>
          <textarea name="description" id="description" rows={5} className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background"></textarea>
          {state.errors?.description && <p className="text-accent-error text-sm mt-1">{state.errors.description[0]}</p>}
        </div>

        {/* Photos */}
        <div>
          <label htmlFor="photos" className="block font-medium text-text-primary mb-2">Photo URLs (comma-separated)</label>
          <input type="text" name="photos" id="photos" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" placeholder="https://url.com/image1.jpg, https://url.com/image2.jpg" />
          <p className="text-sm text-text-secondary mt-1">For now, please paste image URLs separated by a comma. We will build a file uploader next.</p>
          {state.errors?.photos && <p className="text-accent-error text-sm mt-1">{state.errors.photos[0]}</p>}
        </div>

        {/* Is Featured */}
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_featured" id="is_featured" className="w-4 h-4" />
          <label htmlFor="is_featured" className="font-medium text-text-primary">Mark as Featured Property</label>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}