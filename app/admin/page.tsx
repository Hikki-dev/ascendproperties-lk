import { supabase } from '@/lib/supabase/client';
import { Building2, Users, Eye, TrendingUp } from 'lucide-react';
import Image from 'next/image';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getDashboardStats() {
  const { count: propertyCount } = await supabase.from('properties').select('*', { count: 'exact', head: true });
  const { count: enquiryCount } = await supabase.from('enquiries').select('*', { count: 'exact', head: true });
  // Mock views count for now, or sum it up if you have a views column
  const totalViews = 1200; 

  return {
    propertyCount: propertyCount || 0,
    enquiryCount: enquiryCount || 0,
    totalViews,
  };
}

async function getRecentProperties() {
  const { data } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);
  return data || [];
}

async function getRecentEnquiries() {
  const { data } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);
  return data || [];
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const recentProperties = await getRecentProperties();
  const recentEnquiries = await getRecentEnquiries();

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border-light">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              +2 this week
            </span>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">{stats.propertyCount}</h3>
          <p className="text-text-secondary text-sm">Total Properties</p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border-light">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              +5 new
            </span>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">{stats.enquiryCount}</h3>
          <p className="text-text-secondary text-sm">Active Enquiries</p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border-light">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              +12% vs last month
            </span>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">{stats.totalViews / 1000}k</h3>
          <p className="text-text-secondary text-sm">Total Views</p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border-light">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              +0.4%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">2.4%</h3>
          <p className="text-text-secondary text-sm">Conversion Rate</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Enquiries */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border-light">
          <h2 className="text-xl font-bold text-text-primary mb-6">Recent Enquiries</h2>
          <div className="space-y-4">
            {recentEnquiries.length === 0 ? (
              <p className="text-text-secondary">No recent enquiries.</p>
            ) : (
              recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="p-4 bg-ui-soft rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-text-primary">{enquiry.name}</h4>
                    <span className="text-xs text-text-secondary">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">Interested in {enquiry.lead_type}</p>
                  <p className="text-sm text-text-primary line-clamp-1">{enquiry.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border-light">
          <h2 className="text-xl font-bold text-text-primary mb-6">Recent Properties</h2>
          <div className="space-y-4">
            {recentProperties.length === 0 ? (
              <p className="text-text-secondary">No properties added yet.</p>
            ) : (
              recentProperties.map((property) => (
                <div key={property.id} className="flex items-center gap-4 p-4 bg-ui-soft rounded-lg">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <Image
                      src={property.photos?.[0] || 'https://placehold.co/100x100/F1F3F6/6E6E6E?text=No+Image'}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-text-primary truncate">{property.title}</h4>
                    <p className="text-sm text-text-secondary">
                      LKR {(property.price / 1000000).toFixed(1)}M • {property.status === 'sale' ? 'For Sale' : property.status === 'rent' ? 'For Rent' : 'Both'}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
