import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminMobileMenu } from '@/components/admin/AdminMobileMenu';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-ui-soft flex flex-col md:flex-row">
      {/* Sidebar */}
      <AdminSidebar />
      <AdminMobileMenu />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}