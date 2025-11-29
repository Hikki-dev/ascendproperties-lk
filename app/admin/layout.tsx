import Link from 'next/link';
import { LayoutDashboard, Building2, Users, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-ui-soft flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border-light hidden md:flex flex-col">
        <div className="p-6 border-b border-border-light">
          <Link href="/admin" className="text-2xl font-bold text-primary">
            Ascend Admin
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-hover hover:text-primary rounded-lg transition-colors font-medium"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link 
            href="/admin/properties" 
            className="flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-hover hover:text-primary rounded-lg transition-colors font-medium"
          >
            <Building2 className="w-5 h-5" />
            Properties
          </Link>
          <Link 
            href="/admin/enquiries" 
            className="flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-hover hover:text-primary rounded-lg transition-colors font-medium"
          >
            <Users className="w-5 h-5" />
            Enquiries
          </Link>
          <Link 
            href="/admin/settings" 
            className="flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-hover hover:text-primary rounded-lg transition-colors font-medium"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-border-light">
          <button className="flex items-center gap-3 px-4 py-3 text-accent-error hover:bg-accent-error/10 rounded-lg transition-colors w-full">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}