import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white/60">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        {/* Top Section: Brand */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 pb-12 border-b border-white/10">
          <div>
            <Link href="/" className="inline-block">
              <span className="font-serif text-4xl font-bold tracking-wide text-white">
                <span className="text-primary">A</span>SCEND
              </span>
              <span className="block text-[10px] tracking-ultra-wide uppercase text-white/40 font-sans font-medium mt-0.5">
                Properties Sri Lanka
              </span>
            </Link>
          </div>
          <p className="text-white/40 text-sm max-w-md mt-4 md:mt-0 font-light leading-relaxed tracking-wide">
            Curating Sri Lanka&apos;s most exceptional properties for discerning clients since 2010.
            Where luxury meets legacy.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Quick Links */}
          <div>
            <h3 className="text-[11px] font-medium tracking-ultra-wide uppercase text-primary mb-6">Explore</h3>
            <ul className="space-y-3">
              {[
                { href: '/properties', label: 'All Properties' },
                { href: '/buy', label: 'Purchase' },
                { href: '/rent', label: 'Lease' },
                { href: '/about', label: 'Our Story' },
                { href: '/blog', label: 'Journal' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-primary transition-colors duration-300 tracking-wide font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[11px] font-medium tracking-ultra-wide uppercase text-primary mb-6">Services</h3>
            <ul className="space-y-3">
              {[
                'Property Acquisition',
                'Investment Advisory',
                'Property Management',
                'Luxury Rentals',
                'Market Analysis',
              ].map((service) => (
                <li key={service}>
                  <span className="text-sm text-white/50 tracking-wide font-light">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-medium tracking-ultra-wide uppercase text-primary mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/50 font-light tracking-wide">+94 76 150 0000</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/50 font-light tracking-wide">info@ascendproperties.lk</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/50 font-light tracking-wide leading-relaxed">
                  6, R. A. De Mel Mawatha,<br />Colombo 00400, Sri Lanka
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[11px] font-medium tracking-ultra-wide uppercase text-primary mb-6">Private Updates</h3>
            <p className="text-sm text-white/40 mb-5 font-light leading-relaxed tracking-wide">
              Receive exclusive property listings before they reach the market.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 focus:border-primary/40 outline-none text-white text-sm tracking-wide font-light placeholder-white/25 transition-colors duration-300"
              />
              <button className="px-4 bg-primary text-dark hover:bg-primary-light transition-colors duration-300">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30 tracking-wide font-light">
            &copy; {new Date().getFullYear()} Ascend Properties (Pvt) Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-xs text-white/30 hover:text-primary transition-colors tracking-wide font-light">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/30 hover:text-primary transition-colors tracking-wide font-light">
              Terms of Service
            </Link>
            <span className="text-xs text-white/20 tracking-wide font-light">
              Member, Sri Lanka Institute of Valuers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
