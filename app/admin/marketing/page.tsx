'use client';

import { useState } from 'react';
import { Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui or similar components exist, else will fallback to raw jsx
// Since I haven't seen the project's UI library fully, I'll stick to raw Tailwind for safety, but check if I can use existing components.
// I saw "components/ui" in imports in some files, but I'll be safe and use standard tailwind.

export default function MarketingPage() {
  const [formData, setFormData] = useState({
    address: '',
    type: 'Apartment',
    price: '',
    features: ''
  });
  const [generatedContent, setGeneratedContent] = useState<{
    linkedin: string;
    instagram: string;
    email: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'linkedin' | 'instagram' | 'email'>('linkedin');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedContent(null);

    try {
      const response = await fetch('/api/marketing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setGeneratedContent(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Marketing Generator</h1>
        <p className="text-gray-500 mt-2">Generate hyper-personalized listing copy for different platforms instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="font-semibold text-lg mb-4">Property Details</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option>Apartment</option>
                <option>House</option>
                <option>Land</option>
                <option>Commercial</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address / Location</label>
              <input
                required
                type="text"
                placeholder="e.g. 123 Havelock City, Colombo 05"
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                required
                type="text"
                placeholder="e.g. LKR 85 Million"
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Features (Comma separated)</label>
              <textarea
                required
                rows={4}
                placeholder="e.g. Rooftop pool, 3 Bedrooms, Ocean View, Maid's Room"
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                'Generate Listings'
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h2 className="font-semibold text-lg">AI Generated Content</h2>
          </div>

          {!generatedContent && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 ✨
              </div>
              <p>Enter property details and click Generate to see the magic happen.</p>
            </div>
          )}

           {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <Loader2 className="w-8 h-8 animate-spin mb-2" />
               <p>Consulting with top copywriters...</p>
            </div>
          )}

          {generatedContent && (
            <div className="flex flex-col h-full animate-in fade-in duration-500">
              <div className="flex gap-2 mb-4">
                {(['linkedin', 'instagram', 'email'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab 
                        ? 'bg-black text-white shadow-md transform scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="flex-1 relative bg-gray-50 rounded-lg p-4 border border-gray-100">
                <button
                  onClick={() => copyToClipboard(generatedContent[activeTab])}
                  className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                </button>
                <div className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed font-mono">
                  {generatedContent[activeTab]}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
