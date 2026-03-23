"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/auth/UserMenu';
import { MobileMenu } from '@/components/MobileMenu';
import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        scrolled
          ? 'bg-dark/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-white">
                <span className="text-primary">A</span>SCEND
              </span>
              <span className="text-[9px] md:text-[10px] tracking-ultra-wide uppercase text-white/60 font-sans font-medium -mt-1">
                Properties
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { href: '/properties', label: 'Properties' },
              { href: '/buy', label: 'Buy' },
              { href: '/rent', label: 'Rent' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-white/80 hover:text-white transition-colors duration-300 text-sm tracking-wider uppercase font-medium group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-primary to-primary-light group-hover:w-full transition-all duration-500 ease-out" />
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+94761500000"
              className="hidden md:flex items-center gap-2 text-white/70 hover:text-primary transition-colors duration-300 text-sm"
            >
              <Phone className="w-4 h-4" />
              <span className="tracking-wide">+94 76 150 0000</span>
            </a>
            <div className="hidden md:block w-px h-6 bg-white/20" />
            <UserMenu />
            <div className="hidden md:block">
              <Button asChild variant="luxury-outline" size="default" className="rounded-none border-primary/60 text-primary hover:bg-primary/10 px-6">
                <Link href="/contact">Book Consultation</Link>
              </Button>
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
