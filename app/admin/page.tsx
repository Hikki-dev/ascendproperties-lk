import { Building2, Users, Eye, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Properties', value: '12', icon: Building2, change: '+2 this week' },
    { label: 'Active Enquiries', value: '24', icon: Users, change: '+5 new' },
    { label: 'Total Views', value: '1.2k', icon: Eye, change: '+12% vs last month' },
    { label: 'Conversion Rate', value: '2.4%', icon: TrendingUp, change: '+0.4%' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-card p-6 rounded-xl shadow-sm border border-border-light">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm text-accent-success font-medium bg-accent-success/10 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-1">{stat.value}</h3>
              <p className="text-text-secondary">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border-light">
          <h2 className="text-xl font-bold text-text-primary mb-4">Recent Enquiries</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-hover rounded-lg">
                <div>
                  <p className="font-semibold text-text-primary">John Doe</p>
                  <p className="text-sm text-text-secondary">Interested in Luxury Apartment</p>
                </div>
                <span className="text-xs text-text-secondary">2 hours ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border-light">
          <h2 className="text-xl font-bold text-text-primary mb-4">Recent Properties</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-hover rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div>
                    <p className="font-semibold text-text-primary">Modern Villa in Colombo</p>
                    <p className="text-sm text-text-secondary">LKR 45M • For Sale</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-accent-success/10 text-accent-success text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
