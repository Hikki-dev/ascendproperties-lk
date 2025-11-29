"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        className="rounded-full w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center p-0 overflow-hidden"
      >
        <a 
          href="https://wa.me/94761500000" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <div className="relative w-8 h-8">
            <Image 
              src="/images/whatsapp-logo.png" 
              alt="WhatsApp" 
              fill
              className="object-contain"
            />
          </div>
        </a>
      </Button>
    </div>
  );
}
