import { supabase } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import { MapPin, Bed, Bath, Square, Phone, Mail, Home, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; 
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { RelatedProperties } from '@/components/property/RelatedProperties';
import { SaveButton } from '@/components/property/SaveButton';
import { ShareButton } from '@/components/property/ShareButton';

// --- Data Fetching ---
async function getPropertyBySlug(slug: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    notFound();
  }
  return data as Property;
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  // Mock agent data for now (since it wasn't in the shared type)
  const agent = {
    name: 'Adnan',
    email: 'info@ascendproperties.lk',
    phone: '+94 76 150 0000',
    photo_url: '/images/sales-agent.png'
  };

  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in ${property.title} (${property.slug}). Please provide more details.`);
  const whatsappLink = `https://wa.me/94761500000?text=${whatsappMessage}`;

  return (
    <div className="bg-background min-h-screen">
      <main className="max-w-7xl mx-auto p-4 md:p-8 mt-8">
        
        {/* Gallery */}
        <div className="mb-8">
          <PropertyGallery images={property.photos} title={property.title} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column (Details) */}
          <div className="w-full lg:w-2/3">
            {/* Title & Price */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border-light mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-text-primary">{property.title}</h1>
                  <p className="text-lg text-text-secondary flex items-center gap-2 mt-2">
                    <MapPin className="w-5 h-5" />
                    {property.location_city}, {property.location_district}
                  </p>
                </div>
                <div className="flex gap-2">
                  <SaveButton propertyId={property.id} className="text-text-secondary hover:text-accent-error" />
                  <ShareButton title={property.title} />
                </div>
              </div>
              
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

            {/* Related Properties */}
            <RelatedProperties 
              currentPropertyId={property.id} 
              type={property.property_type} 
              city={property.location_city} 
            />
          </div>

          {/* Right Column (Sticky Sidebar) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-card p-6 rounded-2xl shadow-md border border-border-light sticky top-24">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Interested?
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <Image 
                  src={agent.photo_url} 
                  alt={agent.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary" 
                />
                <div>
                  <p className="font-bold text-lg text-text-primary">{agent.name}</p>
                  <p className="text-text-secondary">Sales Agent</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  asChild 
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white h-12 text-lg"
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <div className="relative w-6 h-6 mr-2">
                      <Image 
                        src="/images/whatsapp-logo.png" 
                        alt="WhatsApp" 
                        fill
                        className="object-contain brightness-0 invert"
                      />
                    </div>
                    WhatsApp
                  </a>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full h-12 text-lg border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <a href={`tel:${agent.phone}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    Call Agent
                  </a>
                </Button>

                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full h-12 text-lg border-text-secondary text-text-primary hover:bg-text-secondary hover:text-white transition-colors"
                >
                  <a href={`mailto:${agent.email}`}>
                    <Mail className="w-5 h-5 mr-2" />
                    Send Email
                  </a>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}