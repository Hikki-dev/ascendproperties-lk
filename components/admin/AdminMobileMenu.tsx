"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, Settings, LogOut, Home, Menu, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden bg-card border-b border-border-light p-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/admin" className="text-xl font-bold text-primary">
        Ascend Admin
      </Link>
      
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Menu className="w-6 h-6 text-text-primary" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={closeMenu}
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-card shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b border-border-light">
          <span className="font-bold text-lg text-text-primary">Menu</span>
          <Button variant="ghost" size="icon" onClick={closeMenu}>
            <X className="w-5 h-5 text-text-secondary" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          <Link 
            href="/admin" 
            onClick={closeMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive('/admin') 
                ? 'bg-primary/10 text-primary' 
                : 'text-text-primary hover:bg-hover hover:text-primary'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link 
            href="/admin/properties" 
            onClick={closeMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive('/admin/properties') || pathname.startsWith('/admin/properties/')
                ? 'bg-primary/10 text-primary' 
                : 'text-text-primary hover:bg-hover hover:text-primary'
            }`}
          >
            <Building2 className="w-5 h-5" />
            Properties
          </Link>
          <Link 
            href="/admin/enquiries" 
            onClick={closeMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive('/admin/enquiries') 
                ? 'bg-primary/10 text-primary' 
                : 'text-text-primary hover:bg-hover hover:text-primary'
            }`}
          >
            <Users className="w-5 h-5" />
            Enquiries
          </Link>
          <Link 
            href="/admin/settings" 
            onClick={closeMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
              isActive('/admin/settings') 
                ? 'bg-primary/10 text-primary' 
                : 'text-text-primary hover:bg-hover hover:text-primary'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-light space-y-2 bg-card">
          <Link 
            href="/" 
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-hover hover:text-primary rounded-lg transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <button 
            onClick={() => {
              closeMenu();
              signOut({ callbackUrl: '/' });
            }}
            className="flex items-center gap-3 px-4 py-3 text-accent-error hover:bg-accent-error/10 rounded-lg transition-colors w-full font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
