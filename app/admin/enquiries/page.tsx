import { supabase } from '@/lib/supabase/client';
import { Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getEnquiries() {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching enquiries:', error);
    return [];
  }
  return data;
}

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Enquiries</h1>
        <p className="text-text-primary mt-2">Manage customer leads and messages.</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ui-soft border-b border-border-light">
              <tr>
                <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-bold text-text-primary">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">Name</th>
                <th className="hidden lg:table-cell px-6 py-4 text-left text-sm font-bold text-text-primary">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">Message</th>
                <th className="hidden xl:table-cell px-6 py-4 text-left text-sm font-bold text-text-primary">Status</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-primary">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-hover transition-colors">
                    <td className="hidden md:table-cell px-6 py-4 text-text-primary whitespace-nowrap">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-primary">{enquiry.name}</p>
                      {/* Show contact info on mobile since column is hidden */}
                      <div className="lg:hidden mt-1 space-y-1">
                        <div className="flex items-center text-xs text-text-secondary">
                          <Mail className="w-3 h-3 mr-1" />
                          {enquiry.email}
                        </div>
                        <div className="flex items-center text-xs text-text-secondary">
                          <Phone className="w-3 h-3 mr-1" />
                          {enquiry.phone}
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-text-primary">
                          <Mail className="w-3 h-3 mr-2" />
                          {enquiry.email}
                        </div>
                        <div className="flex items-center text-sm text-text-primary">
                          <Phone className="w-3 h-3 mr-2" />
                          {enquiry.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-text-primary line-clamp-2 max-w-xs">{enquiry.message}</p>
                    </td>
                    <td className="hidden xl:table-cell px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        New
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-text-primary hover:text-accent-success hover:bg-accent-success/10">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-text-primary hover:text-accent-error hover:bg-accent-error/10">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
