import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, Users, Building2, Trophy } from 'lucide-react';
import { CountUp } from '@/components/ui/CountUp';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80"
          alt="About Ascend Properties"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center px-4 max-w-4xl animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Redefining Luxury Living in Sri Lanka
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Your trusted partner for premium residential and commercial properties in Colombo and beyond.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Years Experience', end: 10, suffix: '+', icon: Trophy },
              { label: 'Properties Sold', end: 500, suffix: '+', icon: Building2 },
              { label: 'Happy Clients', end: 1000, suffix: '+', icon: Users },
              { label: 'Awards Won', end: 15, suffix: '', icon: CheckCircle2 },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-text-primary flex justify-center items-center">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </h3>
                  <p className="text-text-secondary font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">Our Mission</h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                At Ascend Properties, we believe that finding a home is more than just a transaction; it's about finding a space where life unfolds. Our mission is to provide a seamless, transparent, and premium real estate experience that empowers our clients to make informed decisions.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-text-primary">Why Choose Ascend?</h3>
              <ul className="space-y-3">
                {[
                  'Unmatched Local Market Knowledge',
                  'Curated Portfolio of Premium Properties',
                  'End-to-End Legal & Financial Support',
                  'Personalized Concierge Service'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-primary text-lg">
                    <CheckCircle2 className="w-5 h-5 text-accent-success shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Button asChild size="lg" variant="primary" className="h-12 px-8 text-lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
             <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
              alt="Our Team"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
              <p className="text-white text-xl font-bold">Dedicated to Excellence</p>
              <p className="text-white/80">Our team of experts is here for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 text-center text-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Browse our exclusive listings or contact our agents for a private consultation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 border-none h-12 px-8 text-lg font-bold">
              <Link href="/properties">Browse Properties</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary h-12 px-8 text-lg font-bold transition-colors">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}