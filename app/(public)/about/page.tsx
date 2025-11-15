import Link from 'next/link';
import { Home, Phone, Mail, MapPin, Award, Users, TrendingUp, ShieldCheck, Target, Eye, Gem } from 'lucide-react';

// Reusable component for "Why Us" items
function InfoCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border-light shadow-sm">
      <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 my-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            About Ascend Properties
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Your trusted partner in navigating the Sri Lankan real estate market. We are dedicated to finding your perfect property with integrity and expertise.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card p-8 rounded-2xl border border-border-light shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Our Mission</h2>
            </div>
            <p className="text-text-secondary text-lg">
              To provide an exceptional, transparent, and personalized real estate experience for every client. We leverage local expertise and modern technology to achieve your property goals, whether you are buying, selling, or renting.
            </p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border-light shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Our Vision</h2>
            </div>
            <p className="text-text-secondary text-lg">
              To be Sri Lanka's most trusted and sought-after real estate agency, renowned for our market knowledge, ethical practices, and unwavering commitment to client success.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-10 text-center">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard 
              icon={Award}
              title="Expert Knowledge"
              description="Our agents possess deep, localized knowledge of Colombo, Galle, and beyond, ensuring you get the best advice and valuation."
            />
            <InfoCard 
              icon={ShieldCheck}
              title="Transparent & Honest"
              description="We operate with 100% transparency. No hidden fees, no surprises—just clear communication from start to finish."
            />
            <InfoCard 
              icon={Users}
              title="Client-Centric Service"
              description="You are our priority. We listen to your unique needs and tailor our services to match your specific goals."
            />
            <InfoCard 
              icon={TrendingUp}
              title="Data-Driven Insights"
              description="We use the latest market data and trends to ensure you're making an informed decision, whether buying or selling."
            />
            <InfoCard 
              icon={Gem}
              title="Curated Portfolio"
              description="We focus on quality. Our listings are carefully selected to offer the best value and opportunities in the market."
            />
            <InfoCard 
              icon={Phone}
              title="Full-Service Support"
              description="From legal consultation to property management, we provide a seamless, end-to-end service for your convenience."
            />
          </div>
        </section>
      </main>
    </div>
  );
}