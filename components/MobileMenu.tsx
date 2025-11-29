"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-text-primary">
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border-b border-border-light shadow-lg p-4 flex flex-col gap-4 z-50 animate-in slide-in-from-top-2">
          <Link 
            href="/buy" 
            className="text-lg font-medium text-text-primary py-2 px-4 hover:bg-hover rounded-lg transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            Buy
          </Link>
          <Link 
            href="/rent" 
            className="text-lg font-medium text-text-primary py-2 px-4 hover:bg-hover rounded-lg transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            Rent
          </Link>
          <Link 
            href="/about" 
            className="text-lg font-medium text-text-primary py-2 px-4 hover:bg-hover rounded-lg transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <div className="pt-2 border-t border-border-light">
            <Button asChild variant="primary" className="w-full justify-center">
              <Link href="/properties" onClick={() => setIsOpen(false)}>Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
