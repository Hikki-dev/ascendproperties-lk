import Image from "next/image";
import { MapPin, Bed, Bath, Square, Star, ChevronDown, Phone, ArrowRight, Quote } from 'lucide-react';
import { HeroSearch } from '@/components/HeroSearch';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/ui/CountUp';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

// ─── Imagined Luxury Property Data ───────────────────────────────────────────

const luxuryProperties = [
  {
    id: '1',
    title: 'The Sapphire Penthouse',
    slug: 'the-sapphire-penthouse',
    location: 'Colombo 03',
    price: 2800000,
    bedrooms: 4,
    bathrooms: 4,
    size: 4200,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    status: 'sale' as const,
    featured: true,
  },
  {
    id: '2',
    title: 'Emerald Bay Villa',
    slug: 'emerald-bay-villa',
    location: 'Galle',
    price: 5200000,
    bedrooms: 6,
    bathrooms: 7,
    size: 8500,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    status: 'sale' as const,
    featured: true,
  },
  {
    id: '3',
    title: 'Cloud Nine Residence',
    slug: 'cloud-nine-residence',
    location: 'Kandy',
    price: 1500000,
    bedrooms: 3,
    bathrooms: 3,
    size: 3200,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    status: 'sale' as const,
    featured: false,
  },
  {
    id: '4',
    title: 'The Palm Estate',
    slug: 'the-palm-estate',
    location: 'Negombo',
    price: 3400000,
    bedrooms: 5,
    bathrooms: 5,
    size: 6800,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    status: 'sale' as const,
    featured: true,
  },
  {
    id: '5',
    title: 'Coral Cove Mansion',
    slug: 'coral-cove-mansion',
    location: 'Mirissa',
    price: 4100000,
    bedrooms: 5,
    bathrooms: 6,
    size: 7200,
    image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80',
    status: 'sale' as const,
    featured: true,
  },
  {
    id: '6',
    title: 'The Lotus Tower Suite',
    slug: 'the-lotus-tower-suite',
    location: 'Colombo 01',
    price: 1800000,
    bedrooms: 2,
    bathrooms: 2,
    size: 2400,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    status: 'rent' as const,
    featured: false,
  },
];

const collections = [
  {
    title: 'Oceanfront Estates',
    subtitle: 'Where the horizon meets home',
    image: 'https://images.unsplash.com/photo-1499793983394-12903e570d5f?w=800&q=80',
    href: '/search?type=house&q=ocean',
    count: 24,
  },
  {
    title: 'City Penthouses',
    subtitle: 'Above it all in Colombo',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    href: '/search?type=Apartment',
    count: 18,
  },
  {
    title: 'Heritage Villas',
    subtitle: 'Colonial charm, modern luxury',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    href: '/search?type=House',
    count: 31,
  },
  {
    title: 'Private Lands',
    subtitle: 'Your vision, our canvas',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    href: '/search?type=Land',
    count: 42,
  },
];

const neighborhoods = [
  {
    name: 'Colombo 07',
    subtitle: 'The Beverly Hills of Sri Lanka',
    description: 'Tree-lined avenues, diplomatic residences, and the island\'s most prestigious addresses.',
    image: 'https://images.unsplash.com/photo-1582407947092-6765e7ec15e1?w=800&q=80',
    properties: 45,
  },
  {
    name: 'Galle Fort',
    subtitle: 'UNESCO Heritage Living',
    description: 'Where 17th-century Dutch colonial architecture meets contemporary coastal luxury.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    properties: 28,
  },
  {
    name: 'Kandy Hills',
    subtitle: 'Mountain Serenity',
    description: 'Misty highlands, tea estates, and panoramic views of Sri Lanka\'s cultural capital.',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52e0a3?w=800&q=80',
    properties: 19,
  },
  {
    name: 'Mirissa Coast',
    subtitle: 'Tropical Paradise',
    description: 'Golden beaches, whale watching, and the south coast\'s most coveted beachfront properties.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    properties: 22,
  },
];

const testimonials = [
  {
    name: 'Alexandra Chen',
    title: 'CEO, Pacific Ventures',
    content: 'Ascend Properties understood exactly what we were looking for. Their attention to detail and deep knowledge of Sri Lanka\'s luxury market is unmatched. They found us our dream oceanfront villa within weeks.',
    rating: 5,
  },
  {
    name: 'James & Priya Ratnayake',
    title: 'Property Investors, London',
    content: 'We\'ve worked with luxury real estate firms worldwide, and Ascend stands among the very best. Their discretion, market insight, and commitment to excellence made our investment journey seamless.',
    rating: 5,
  },
  {
    name: 'Dr. Haruto Nakamura',
    title: 'Retired Surgeon, Tokyo',
    content: 'From the initial consultation to handing over the keys to our Galle Fort heritage home, every interaction was impeccable. Ascend doesn\'t just sell properties — they curate lifestyles.',
    rating: 5,
  },
];

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function LuxuryHomepage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">

      {/* ━━━ HERO SECTION ━━━ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=85"
            alt="Luxury Villa in Sri Lanka"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <div className="max-w-4xl">
            {/* Decorative line */}
            <div className="w-16 h-[1px] bg-primary mb-8 animate-fade-in-up" />

            <p className="text-primary text-sm tracking-ultra-wide uppercase font-medium mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Sri Lanka&apos;s Premier Luxury Real Estate
            </p>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-8xl font-bold mb-6 animate-fade-in-up text-white leading-[1.1]" style={{ animationDelay: '0.2s' }}>
              Extraordinary<br />
              <span className="text-gold-gradient">Living</span> Awaits
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-12 animate-fade-in-up max-w-2xl font-light tracking-wide leading-relaxed" style={{ animationDelay: '0.3s' }}>
              Discover the finest residences across Sri Lanka — from Colombo&apos;s skyline penthouses to Galle&apos;s heritage estates and Mirissa&apos;s beachfront villas.
            </p>

            <HeroSearch />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-scroll-hint">
          <span className="text-white/40 text-[10px] tracking-ultra-wide uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-primary" />
        </div>
      </section>

      {/* ━━━ BRAND STATEMENT ━━━ */}
      <AnimatedSection className="py-24 md:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="luxury-divider mb-10" />
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-dark leading-relaxed font-light">
            Curating Sri Lanka&apos;s most exceptional properties for discerning clients.
            <span className="text-primary"> Since 2010</span>, we have connected extraordinary people with extraordinary places.
          </p>
          <div className="luxury-divider mt-10" />
        </div>
      </AnimatedSection>

      {/* ━━━ EXCLUSIVE COLLECTIONS ━━━ */}
      <AnimatedSection className="py-20 md:py-28 bg-[#F7F3EC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-primary text-[11px] tracking-ultra-wide uppercase font-medium mb-4">Curated For You</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-dark">
              Exclusive Collections
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.map((collection, index) => (
              <Link
                key={index}
                href={collection.href}
                className="group relative h-[400px] md:h-[500px] overflow-hidden block"
              >
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-700" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="text-primary text-[10px] tracking-ultra-wide uppercase font-medium mb-2">
                    {collection.count} Properties
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2 group-hover:translate-y-0 transition-transform duration-500">
                    {collection.title}
                  </h3>
                  <p className="text-white/60 text-sm font-light tracking-wide">
                    {collection.subtitle}
                  </p>
                  <div className="w-8 h-[1px] bg-primary mt-4 group-hover:w-16 transition-all duration-700" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ━━━ FEATURED PROPERTIES ━━━ */}
      <AnimatedSection className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <p className="text-primary text-[11px] tracking-ultra-wide uppercase font-medium mb-4">Hand-Selected</p>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-dark">
                Featured Properties
              </h2>
            </div>
            <Link
              href="/properties"
              className="mt-4 md:mt-0 text-primary text-sm tracking-wider uppercase font-medium flex items-center gap-2 group hover:gap-3 transition-all duration-300"
            >
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Asymmetric Grid - Row 1: 1 large + 2 small */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Large Feature Card */}
            <PropertyShowcase property={luxuryProperties[0]} large />
            {/* Two stacked cards */}
            <div className="grid grid-rows-2 gap-4">
              <PropertyShowcase property={luxuryProperties[1]} />
              <PropertyShowcase property={luxuryProperties[2]} />
            </div>
          </div>

          {/* Row 2: 2 small + 1 large */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="grid grid-rows-2 gap-4">
              <PropertyShowcase property={luxuryProperties[3]} />
              <PropertyShowcase property={luxuryProperties[4]} />
            </div>
            <PropertyShowcase property={luxuryProperties[5]} large />
          </div>
        </div>
      </AnimatedSection>

      {/* ━━━ ANIMATED STATS ━━━ */}
      <section className="py-20 md:py-24 bg-dark text-white relative overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { end: 18, suffix: '+', label: 'Years of Excellence' },
              { end: 1200, suffix: '+', label: 'Properties Curated' },
              { end: 2500, suffix: '+', label: 'Distinguished Clients' },
              { end: 98, suffix: '%', label: 'Client Satisfaction' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-4xl md:text-6xl font-bold text-primary mb-3 flex justify-center items-baseline">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="text-[11px] tracking-ultra-wide uppercase text-white/40 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ LUXURY NEIGHBORHOODS ━━━ */}
      <AnimatedSection className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-primary text-[11px] tracking-ultra-wide uppercase font-medium mb-4">Discover</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-dark">
              Sri Lanka&apos;s Most Coveted Addresses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {neighborhoods.map((area, index) => (
              <Link
                key={index}
                href={`/search?q=${area.name}`}
                className="group relative h-[300px] md:h-[400px] overflow-hidden block"
              >
                <Image
                  src={area.image}
                  alt={area.name}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-700" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-primary text-[10px] tracking-ultra-wide uppercase font-medium mb-2">
                    {area.properties} Properties
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-1">
                    {area.name}
                  </h3>
                  <p className="text-white/80 text-sm font-medium mb-2">{area.subtitle}</p>
                  <p className="text-white/50 text-sm font-light leading-relaxed max-w-md">
                    {area.description}
                  </p>
                  <div className="w-8 h-[1px] bg-primary mt-5 group-hover:w-16 transition-all duration-700" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section className="py-20 md:py-28 bg-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-primary text-[11px] tracking-ultra-wide uppercase font-medium mb-4">Testimonials</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white">
              Words From Our Clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="border border-white/10 p-8 md:p-10 hover:border-primary/30 transition-colors duration-500 group"
              >
                <Quote className="w-8 h-8 text-primary/40 mb-6" />

                <div className="flex gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-white/70 text-sm leading-relaxed mb-8 font-light">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="border-t border-white/10 pt-6">
                  <div className="font-serif text-lg font-semibold text-white">{testimonial.name}</div>
                  <div className="text-primary/70 text-xs tracking-wider uppercase mt-1">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ LUXURY CTA ━━━ */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=85"
            alt="Luxury Estate"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="luxury-divider mb-8" />
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Begin Your Journey
          </h2>
          <p className="text-white/60 text-lg md:text-xl font-light tracking-wide mb-10 leading-relaxed">
            Let our team of experts guide you to the property of your dreams.
            Experience real estate the way it was meant to be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="luxury-outline" size="xl" className="rounded-none border-primary text-primary hover:bg-primary hover:text-dark px-10 tracking-widest">
              <Link href="/contact">Schedule a Private Viewing</Link>
            </Button>
            <Button asChild variant="luxury-outline" size="xl" className="rounded-none border-white/30 text-white hover:bg-white/10 px-10 tracking-widest">
              <a href="tel:+94761500000">
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Property Showcase Card (used in Featured grid) ──────────────────────────

function PropertyShowcase({ property, large = false }: {
  property: typeof luxuryProperties[0];
  large?: boolean;
}) {
  return (
    <Link
      href={`/property/${property.slug}`}
      className={`group relative overflow-hidden block ${large ? 'h-[400px] md:h-full min-h-[500px]' : 'h-[240px] md:h-full min-h-[240px]'}`}
    >
      <Image
        src={property.image}
        alt={property.title}
        fill
        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-700" />

      {/* Status Badge */}
      <div className="absolute top-4 left-4">
        <span className="bg-dark/70 backdrop-blur-sm text-white px-4 py-1.5 text-[10px] tracking-widest uppercase font-medium border border-white/10">
          For {property.status === 'sale' ? 'Sale' : 'Lease'}
        </span>
      </div>

      {/* Featured Badge */}
      {property.featured && (
        <div className="absolute top-4 right-4">
          <span className="bg-primary/90 backdrop-blur-sm text-dark px-3 py-1.5 text-[10px] tracking-widest uppercase font-medium flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Exclusive
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="w-8 h-[1px] bg-primary mb-4" />
        <p className="text-white/60 text-xs tracking-wider uppercase mb-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {property.location}
        </p>
        <h3 className={`font-serif font-bold text-white mb-2 ${large ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
          {property.title}
        </h3>
        <p className="font-serif text-primary text-xl md:text-2xl font-semibold mb-3">
          ${(property.price / 1000000).toFixed(1)}M
        </p>
        <div className="flex gap-4 text-white/50 text-xs tracking-wide">
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <Bed className="w-3 h-3" />
              {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="w-3 h-3" />
              {property.bathrooms} Baths
            </span>
          )}
          {property.size && (
            <span className="flex items-center gap-1">
              <Square className="w-3 h-3" />
              {property.size.toLocaleString()} sqft
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
