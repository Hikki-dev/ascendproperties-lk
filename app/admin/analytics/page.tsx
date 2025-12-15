'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Users, ArrowUpRight, DollarSign, Sparkles } from 'lucide-react';

const priceData = [
  { month: 'Jan', listed: 85, sold: 82 },
  { month: 'Feb', listed: 88, sold: 86 },
  { month: 'Mar', listed: 90, sold: 89 },
  { month: 'Apr', listed: 92, sold: 88 },
  { month: 'May', listed: 95, sold: 94 },
  { month: 'Jun', listed: 94, sold: 93 },
];

const inquiryData = [
  { month: 'Jan', rentals: 45, sales: 20 },
  { month: 'Feb', rentals: 52, sales: 22 },
  { month: 'Mar', rentals: 48, sales: 25 },
  { month: 'Apr', rentals: 61, sales: 28 },
  { month: 'May', rentals: 55, sales: 30 },
  { month: 'Jun', rentals: 67, sales: 35 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Market Analytics 📈</h1>
          <p className="text-gray-500 mt-1">Real-time insights and predictive modeling for Colombo real estate.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4" />
          AI Analysis Active
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
             </div>
             <span className="text-green-600 text-sm font-medium flex items-center">
                +12.5% <ArrowUpRight className="w-3 h-3 ml-1" />
             </span>
          </div>
          <p className="text-gray-500 text-sm">Avg. Price / Sqft (Colombo 05)</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">LKR 42,500</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
             </div>
             <span className="text-green-600 text-sm font-medium flex items-center">
                +8.2% <ArrowUpRight className="w-3 h-3 ml-1" />
             </span>
          </div>
          <p className="text-gray-500 text-sm">Total Inquiries (This Month)</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">1,248</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-purple-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
             </div>
             <span className="text-gray-500 text-sm font-medium">
                Stable
             </span>
          </div>
          <p className="text-gray-500 text-sm">Listing vs Sold Variance</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">1.8%</h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Price Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Listing vs Sold Price Trends (Millions LKR)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="listed" name="Avg Listing Price" stroke="#000000" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="sold" name="Avg Sold Price" stroke="#8884d8" strokeWidth={2} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inquiry Volume Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Inquiry Volume by Type</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inquiryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="rentals" name="Rentals" fill="#000000" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sales" name="Sales" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* AI Summary Section */}
       <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              AI Strategic Insight
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-2xl">
              "Based on the last 6 months of data, there is a <strong>divergence</strong> forming in June. While rental demand is surging (+12%), sales inquiries remain flat. Recommendation: Shift marketing budget towards <strong>luxury rentals in Colombo 03 & 07</strong> for the next quarter to capitalize on expatriate arrival trends."
            </p>
          </div>
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
       </div>
    </div>
  );
}
