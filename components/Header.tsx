import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginButton } from "@/components/auth/LoginButton";
import { UserMenu } from '@/components/auth/UserMenu';

export function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-text-primary">AscendProperties.lk</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/buy" className="text-text-secondary hover:text-primary transition-colors font-medium">Buy</Link>
            <Link href="/rent" className="text-text-secondary hover:text-primary transition-colors font-medium">Rent</Link>
            <Link href="/sell" className="text-text-secondary hover:text-primary transition-colors font-medium">Sell</Link>
            <Link href="/about" className="text-text-secondary hover:text-primary transition-colors font-medium">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <UserMenu />
          <Button asChild variant="primary">
            <Link href="/properties">Get Started</Link>
          </Button>
          </div>
        </div>
      </div>
    </header>
  );
}