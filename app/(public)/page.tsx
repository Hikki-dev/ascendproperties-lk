import { createClient, createAdminClient } from '@/lib/supabase/server';
import Image from "next/image";
import { LucideIcon, Search, Home, Building2, MapPin, Bed, Bath, Square, Phone, Mail, MessageSquare, ChevronRight, Star } from 'lucide-react';
import { HeroSearch } from '@/components/HeroSearch';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';

// 1. Define the PropertyType for the counts
type PropertyType = {
  icon: LucideIcon;
  label: string;
  value: string;
  count: number;
};

// 2. Function to get featured properties
async function getFeaturedProperties() {
  try {
    // USE ADMIN CLIENT for public data to bypass cookie/RLS overhead which might be causing timeouts
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('properties')
      .select('id, title, slug, status, price, location_city, bedrooms, bathrooms, size_sqft, photos, is_featured')
      .eq('is_featured', true)
      .eq('status', 'sale')
      .limit(6);

    if (error) throw error;
    // Map data to include a single 'image' for the card
    return (data || []).map(item => ({
      ...item,
      image: item.photos?.[0] || 'https://placehold.co/400x300/F1F3F6/6E6E6E?text=No+Image', // Use first photo or placeholder
    })) as (Property & { image: string })[];
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
}

// 2.a Function to get new properties
async function getNewProperties() {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('properties')
      .select('id, title, slug, status, price, location_city, bedrooms, bathrooms, size_sqft, photos, is_featured, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching new properties:', error);
      return [];
    }
    return data.map(item => ({
      ...item,
      image: item.photos?.[0] || 'https://placehold.co/400x300/F1F3F6/6E6E6E?text=No+Image',
    })) as (Property & { image: string })[];
  } catch (err) {
     console.error('Unexpected error fetching new properties:', err);
     return [];
  }
}


// 3. Function to get property types and counts
async function getPropertyTypes(): Promise<PropertyType[]> {
  const supabase = await createClient();
  const types = [
    { value: 'house', label: 'House', icon: Home },
    { value: 'apartment', label: 'Apartment', icon: Building2 },
    { value: 'land', label: 'Land', icon: MapPin },
    { value: 'commercial', label: 'Commercial', icon: Building2 }
  ];

  const counts = await Promise.all(
    types.map(async (type) => {
      const { count } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('property_type', type.value);
      return count || 0;
    })
  );

  return types.map((type, index) => ({
    icon: type.icon,
    label: type.label,
    value: type.value, // Add value to type definition if needed, or just use label for display and value for link
    count: counts[index]
  })) as any; // Cast to any to avoid strict type checking for now or update PropertyType
}

const AscendPropertiesHomepage = async () => {
  const featuredProperties = await getFeaturedProperties();
  const newProperties = await getNewProperties();
  const propertyTypes = await getPropertyTypes();

  const testimonials = [
    { name: 'Priya Fernando', role: 'Homebuyer', content: 'Ascend Properties made our dream home a reality...', rating: 5 },
    { name: 'Ravi Perera', role: 'Property Investor', content: 'Best real estate agency in Colombo...', rating: 5 }
  ];

  const whyChooseUs = [
    { icon: Star, title: "Luxury Experts", desc: "Specializing in premium properties across Sri Lanka." },
    { icon: MapPin, title: "Local Insight", desc: "Deep knowledge of Colombo's most exclusive neighborhoods." },
    { icon: Home, title: "Trusted Partners", desc: "Guiding you through every step of the buying or selling process." },
    { icon: Phone, title: "Personal Service", desc: "Dedicated agents focused on your unique requirements." }
  ];

  const neighborhoods = [
    { name: "Colombo 03", image: "/images/colombo-03.jpg", count: "Check Availability" },
    { name: "Colombo 7", image: "/images/colombo-07.jpg", count: "1 Property Available" },
    { name: "Galle Face", image: "/images/galle-face.jpg", count: "Check Availability" },
    { name: "Rajagiriya", image: "/images/rajagiriya.jpg", count: "Check Availability" }
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Galle Face Green Colombo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" /> {/* Overlay for readability */}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in-up text-white drop-shadow-lg">
              Find Your Dream Home in Sri Lanka
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 animate-fade-in-up drop-shadow-md" style={{ animationDelay: '0.1s' }}>
              Discover luxury properties from Colombo to Galle
            </p>

            <HeroSearch />

          </div>
        </div>
      </section>

      {/* Why Choose Ascend */}
      <section className="py-10 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12">Why Choose Ascend</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {whyChooseUs.map((item, index) => (
                    <div key={index} className="flex flex-col items-center p-6 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <item.icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-3">{item.title}</h3>
                        <p className="text-text-secondary">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-10 md:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-10 text-center">
            Browse by Property Type
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {propertyTypes.map((type: PropertyType, index: number) => {
              const Icon = type.icon;
              return (
                <Link 
                  href={`/search?type=${type.value}`}
                  key={index}
                  className="group bg-hover rounded-2xl p-8 hover:bg-primary transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 block"
                >
                  <Icon className="w-12 h-12 text-primary group-hover:text-white mb-4 transition-colors" />
                  <h3 className="text-xl font-bold text-text-primary group-hover:text-white mb-2 transition-colors">
                    {type.label}
                  </h3>
                  <p className="text-text-secondary group-hover:text-white/90 transition-colors">
                    {type.count} properties
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Listings (Auto-populated) */}
      <section className="py-10 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              New Listings
            </h2>
            <Link href="/search?sort=newest" className="text-primary hover:text-opacity-80 font-semibold flex items-center gap-2 group">
              View All
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProperties.map((property) => (
              <Link 
                href={`/property/${property.slug}`}
                key={property.id}
                className="group bg-card rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-2 block border border-border-light"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg ${
                      property.status === 'sale' ? 'bg-accent-error text-white' : 'bg-accent-success text-white'
                    }`}>
                      For {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </div>
                  {property.is_featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-accent-gold text-text-primary px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                        <Star className="w-4 h-4 fill-current" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    LKR {(property.price / 1000000).toFixed(1)}M
                  </h3>
                  <p className="text-lg font-semibold text-text-primary mb-1">{property.title}</p>
                  <p className="text-text-secondary mb-4 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.location_city}
                  </p>

                  <div className="flex gap-4 text-sm text-text-secondary border-t border-border-light pt-4">
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {property.bedrooms} beds
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {property.bathrooms} baths
                      </div>
                    )}
                    {property.size_sqft && (
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        {property.size_sqft} sqft
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-10 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              Featured Properties
            </h2>
            <Link href="/buy?featured=true" className="text-primary hover:text-opacity-80 font-semibold flex items-center gap-2 group">
              View All
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <Link 
                href={`/property/${property.slug}`}
                key={property.id}
                className="group bg-card rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-2 block border border-border-light"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg ${
                      property.status === 'sale' ? 'bg-accent-error text-white' : 'bg-accent-success text-white'
                    }`}>
                      For {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </div>
                  {property.is_featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-accent-gold text-text-primary px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                        <Star className="w-4 h-4 fill-current" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    LKR {(property.price / 1000000).toFixed(1)}M
                  </h3>
                  <p className="text-lg font-semibold text-text-primary mb-1">{property.title}</p>
                  <p className="text-text-secondary mb-4 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.location_city}
                  </p>

                  <div className="flex gap-4 text-sm text-text-secondary border-t border-border-light pt-4">
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {property.bedrooms} beds
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {property.bathrooms} baths
                      </div>
                    )}
                    {property.size_sqft && (
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        {property.size_sqft} sqft
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhood Guides */}
      <section className="py-10 md:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12 text-center">Popular Neighborhoods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {neighborhoods.map((area, index) => (
                    <Link href={`/search?q=${area.name}`} key={index} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer">
                        {/* Placeholder for neighborhood images - since we don't have them yet, using a color block/pattern or a placeholder image service */}
                        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors z-10" />
                        <Image
                            src={`https://placehold.co/400x600/1877F2/FFFFFF?text=${area.name}`}
                            alt={area.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            unoptimized
                        />
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-2 transition-transform">{area.name}</h3>
                            <p className="text-white/80 text-sm group-hover:translate-x-2 transition-transform delay-75">{area.count}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-10 md:py-16 bg-hover">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10+</div>
              <div className="text-text-secondary">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-text-secondary">Properties Sold</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1000+</div>
              <div className="text-text-secondary">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4.9</div>
              <div className="text-text-secondary">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-10 text-center">
            What Our Clients Say
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 hover:shadow-xl transition-shadow border border-border-light">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent-gold text-accent-gold" />
                  ))}
                </div>
                <p className="text-text-secondary text-lg mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold text-text-primary">{testimonial.name}</div>
                  <div className="text-text-secondary">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 md:py-20 bg-gradient-to-r from-primary to-blue-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl mb-8 text-white/80">
            Let our expert team help you discover the perfect home in Sri Lanka
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/94761500000" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 h-auto py-4 px-8 text-lg w-full sm:w-auto">
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </Button>
            </a>
            <a href="tel:+94761500000">
              <Button variant="primary" className="bg-text-primary text-white hover:bg-black h-auto py-4 px-8 text-lg w-full sm:w-auto">
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AscendPropertiesHomepage;