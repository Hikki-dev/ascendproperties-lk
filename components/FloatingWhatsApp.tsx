"use client";

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        asChild
        className="rounded-full w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center p-0"
      >
        <a 
          href="https://wa.me/94761500000" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-7 h-7" />
        </a>
      </Button>
    </div>
  );
}
