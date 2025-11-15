// app/(public)/page.tsx

import { supabase } from '@/lib/supabase/client';
import Image from "next/image";
import Link from 'next/link';
// 1. IMPORT `LucideIcon`
import { LucideIcon, Search, Home, Building2, MapPin, Bed, Bath, Square, Phone, Mail, MessageSquare, ChevronRight, Star } from 'lucide-react';
import { HeroSearch } from '@/components/HeroSearch';

// --- Data Fetching Functions ---

type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number | null;
  bathrooms: number;
  sqft: number;
  image: string;
  status: string;
  featured: boolean;
};

// 2. DEFINE THE 'PropertyType' TYPE
type PropertyType = {
  icon: LucideIcon;
  label: string;
  count: number;
};

async function getFeaturedProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('featured', true)
    .limit(3);

  if (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
  return data as Property[];
}

// 3. ADD PROMISE<PropertyType[]> AS THE RETURN TYPE
async function getPropertyTypes(): Promise<PropertyType[]> {
  const { data, error } = await supabase
    .rpc('get_property_type_counts')

  if (error) {
    console.error('Error fetching property types:', error);
    return [
      { icon: Home, label: 'Houses', count: 124 },
      { icon: Building2, label: 'Apartments', count: 89 },
      { icon: MapPin, label: 'Land', count: 56 },
      { icon: Building2, label: 'Commercial', count: 34 }
    ];
  }
  
  return data.map((type: { property_type: string, count: number }) => ({
    icon: type.property_type === 'House' ? Home : 
          type.property_type === 'Apartment' ? Building2 :
          type.property_type === 'Land' ? MapPin : Building2,
    label: type.property_type,
    count: type.count
  }));
}

// --- SQL Function (no change needed) ---
/*
  create or replace function get_property_type_counts()
  ...
*/

// --- Your Component (Now a Server Component) ---

const AscendPropertiesHomepage = async () => {
  const featuredProperties = await getFeaturedProperties();
  const propertyTypes = await getPropertyTypes();

  const testimonials = [
    { name: 'Priya Fernando', role: 'Homebuyer', content: 'Ascend Properties made our dream home a reality...', rating: 5 },
    { name: 'Ravi Perera', role: 'Property Investor', content: 'Best real estate agency in Colombo...', rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">AscendProperties.lk</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/buy" className="text-slate-700 hover:text-red-600 transition-colors font-medium">Buy</Link>
              <Link href="/rent" className="text-slate-700 hover:text-red-600 transition-colors font-medium">Rent</Link>
              <Link href="/sell" className="text-slate-700 hover:text-red-600 transition-colors font-medium">Sell</Link>
              <Link href="/about" className="text-slate-700 hover:text-red-600 transition-colors font-medium">About</Link>
            </nav>
            <button className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-all font-semibold hover:shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-blue-600/30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Find Your Dream Home in Sri Lanka
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Discover luxury properties from Colombo to Galle
            </p>
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Property Types (now dynamic) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">
            Browse by Property Type
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* 4. ADD TYPES to the .map() parameters */}
            {propertyTypes.map((type: PropertyType, index: number) => {
              const Icon = type.icon;
              return (
                <div 
                  key={index}
                  className="group bg-gray-50 rounded-2xl p-8 hover:bg-red-600 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
                >
                  <Icon className="w-12 h-12 text-red-600 group-hover:text-white mb-4 transition-colors" />
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-white mb-2 transition-colors">
                    {type.label}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white/90 transition-colors">
                    {type.count} properties
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      

      {/* Featured Properties (now dynamic) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Featured Properties
            </h2>
            <Link href="/buy" className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 group">
              View All
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* (Optional but good practice) Also type this map */}
            {featuredProperties.map((property: Property) => (
              <Link 
                href={`/properties/${property.id}`}
                key={property.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-2 block"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                      {property.status}
                    </span>
                  </div>
                  {property.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-400 text-slate-900 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                        <Star className="w-4 h-4 fill-current" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    LKR {(property.price / 1000000).toFixed(1)}M
                  </h3>
                  <p className="text-lg font-semibold text-slate-700 mb-1">{property.title}</p>
                  <p className="text-gray-500 mb-4 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-600 border-t pt-4">
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {property.bedrooms} beds
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.bathrooms} baths
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      {property.sqft} sqft
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ... Rest of your static sections (Trust, Testimonials, CTA, Footer) ... */}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AscendPropertiesHomepage;