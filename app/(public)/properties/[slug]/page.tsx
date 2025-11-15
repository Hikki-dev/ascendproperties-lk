import { supabase } from '../../../../lib/supabase/client';
import { notFound } from 'next/navigation';
import { MapPin, Bed, Bath, Square, Phone, Mail, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; 

// --- Type Definitions ---
type Agent = {
  name: string;
  email: string;
  phone: string;
  photo_url: string;
} | null;

type Property = {
  id: string;
  title: string;
  slug: string;
  property_type: string;
  status: string;
  price: number;
  location_city: string;
  location_district: string;
  address: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqft: number | null;
  description: string | null;
  photos: string[];
  amenities: string[]; // Assuming amenities is jsonb -> string[]
  agents: Agent;
};

// --- Data Fetching ---
async function getPropertyBySlug(slug: string) {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      agents ( name, email, phone, photo_url )
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    notFound(); // Triggers the 404 page
  }
  return data as Property;
}

// --- Main Page Component ---
export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const property = await getPropertyBySlug(params.slug);

  const agent = property.agents || {
    name: 'Ascend Properties',
    email: 'info@ascendproperties.lk',
    phone: '+94 76 150 0000',
    photo_url: 'https://placehold.co/100x100/1877F2/FFFFFF?text=A'
  };

  return (
    <div className="bg-background min-h-screen">
      {/* --- Header --- */}
      <header className="bg-card shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-text-primary">AscendProperties.lk</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/buy" className="text-text-secondary hover:text-primary transition-colors font-medium">Buy</Link>
            <Link href="/rent" className="text-text-secondary hover:text-primary transition-colors font-medium">Rent</Link>
            <Link href="/sell" className="text-text-secondary hover:text-primary transition-colors font-medium">Sell</Link>
            <Link href="/about" className="text-text-secondary hover:text-primary transition-colors font-medium">About</Link>
          </nav>
          <button className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-all font-semibold hover:shadow-lg">
            Get Specialized Help
          </button>
        </div>
      </header>
      
      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 mt-8">
        {/* --- Image Gallery (like example) --- */}
        <div className="relative h-[300px] md:h-[550px] w-full overflow-hidden rounded-2xl mb-8 border border-border-light">
          <Image
            src={property.photos?.[0] || 'https://placehold.co/1200x600/F1F3F6/6E6E6E?text=No+Image'}
            alt={property.title}
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- Left Column (Details) --- */}
          <div className="w-full lg:w-2/3">
            {/* Title & Price */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border-light mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary">{property.title}</h1>
              <p className="text-lg text-text-secondary flex items-center gap-2 mt-2">
                <MapPin className="w-5 h-5" />
                {property.address || `${property.location_city}, ${property.location_district}`}
              </p>
              <div className="border-t border-border-light my-4"></div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-text-secondary">Price</p>
                  <p className="text-3xl font-bold text-primary">
                    LKR {(property.price / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-secondary">Status</p>
                  <p className={`text-xl font-bold ${
                    property.status === 'sale' ? 'text-accent-error' : 'text-accent-success'
                  }`}>
                    For {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Facts */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border-light mb-6">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Key Facts</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-lg">
                <span className="flex items-center gap-2 text-text-primary">
                  <Bed className="w-5 h-5 text-primary" /> 
                  {property.bedrooms || 'N/A'} Beds
                </span>
                <span className="flex items-center gap-2 text-text-primary">
                  <Bath className="w-5 h-5 text-primary" /> 
                  {property.bathrooms || 'N/A'} Baths
                </span>
                <span className="flex items-center gap-2 text-text-primary">
                  <Square className="w-5 h-5 text-primary" /> 
                  {property.size_sqft || 'N/A'} sqft
                </span>
                <span className="flex items-center gap-2 text-text-primary">
                  <Home className="w-5 h-5 text-primary" /> 
                  {property.property_type}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border-light mb-6">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Description</h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {property.description || 'No description available.'}
              </p>
            </div>
            
            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-border-light mb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.amenities.map(item => (
                    <span key={item} className="text-text-secondary">{item}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* --- Right Column (Sticky Sidebar) --- */}
          <div className="w-full lg:w-1/3">
            <div className="bg-card p-6 rounded-2xl shadow-md border border-border-light sticky top-24">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Agent Information
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <Image 
                  src={agent.photo_url} 
                  alt={agent.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary" 
                />
                <div>
                  <p className="font-bold text-lg text-text-primary">{agent.name}</p>
                  <p className="text-text-secondary">{agent.phone}</p>
                </div>
              </div>
              <a 
                href={`tel:${agent.phone}`}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-5 h-5" />
                Contact Agent
              </a>
              <a 
                href={`mailto:${agent.email}`}
                className="w-full bg-hover text-text-primary mt-2 py-3 rounded-lg font-semibold hover:bg-border-light flex items-center justify-center gap-2 transition-all"
              >
                <Mail className="w-5 h-5" />
                Send Email
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}