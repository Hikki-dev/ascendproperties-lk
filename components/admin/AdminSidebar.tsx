"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, Settings, LogOut, Home, Megaphone, BookOpen, BarChart3 } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-card border-r border-border-light hidden md:flex flex-col">
      <div className="p-6 border-b border-border-light">
        <Link href="/admin" className="text-2xl font-bold text-primary">
          Ascend Admin
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link 
          href="/admin" 
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
          href="/admin/marketing" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
            isActive('/admin/marketing') 
              ? 'bg-primary/10 text-primary' 
              : 'text-text-primary hover:bg-hover hover:text-primary'
          }`}
        >
          <Megaphone className="w-5 h-5" />
          Marketing
        </Link>
        <Link 
          href="/admin/knowledge-base" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
            isActive('/admin/knowledge-base') 
              ? 'bg-primary/10 text-primary' 
              : 'text-text-primary hover:bg-hover hover:text-primary'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          Knowledge Base
        </Link>
        <Link 
          href="/admin/analytics" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
            isActive('/admin/analytics') 
              ? 'bg-primary/10 text-primary' 
              : 'text-text-primary hover:bg-hover hover:text-primary'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          Analytics
        </Link>
        <Link 
          href="/admin/settings" 
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

      <div className="p-4 border-t border-border-light space-y-2">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-hover hover:text-primary rounded-lg transition-colors font-medium"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 text-accent-error hover:bg-accent-error/10 rounded-lg transition-colors w-full font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
