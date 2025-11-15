import Link from 'next/link';
import { Home, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-text-primary text-white/70 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AscendProperties</span>
            </div>
            <p className="text-white/60">Your trusted partner in finding the perfect property in Sri Lanka.</p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/buy" className="hover:text-primary transition-colors">Buy Property</Link></li>
              <li><Link href="/rent" className="hover:text-primary transition-colors">Rent Property</Link></li>
              <li><Link href="/sell" className="hover:text-primary transition-colors">Sell Property</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +94 76 150 0000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                info@ascendproperties.lk
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                6, 4 R. A. De Mel Mawatha, Colombo 00400
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Newsletter</h3>
            <p className="text-white/60 mb-4">Get the latest property listings in your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg bg-black/30 border border-white/20 focus:border-primary outline-none text-white"
              />
              <button className="bg-primary px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/60">
          <p>© 2024 Ascend Properties (Pvt) Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}