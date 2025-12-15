import Link from 'next/link';
import { Home } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LoginButton } from "@/components/auth/LoginButton";
import { UserMenu } from '@/components/auth/UserMenu';
import { MobileMenu } from '@/components/MobileMenu';

export function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-64 h-20">
              <Image 
                src="/images/logo.png" 
                alt="Ascend Properties" 
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/buy" className="text-text-secondary hover:text-primary transition-colors font-medium">Buy</Link>
            <Link href="/rent" className="text-text-secondary hover:text-primary transition-colors font-medium">Rent</Link>
            <Link href="/about" className="text-text-secondary hover:text-primary transition-colors font-medium">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <UserMenu />
            <div className="hidden md:block">
              <Button asChild variant="primary">
                <Link href="/properties">Get Started</Link>
              </Button>
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}