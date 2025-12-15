'use client';

import { useState } from 'react';
import { Search, FileText, ChevronRight, BookOpen } from 'lucide-react';

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ title: string; snippet: string; source: string }[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResults(null);

    // Mock RAG Logic (simulating Vertex AI Search)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Hardcoded responses based on keywords
    const lowerQuery = query.toLowerCase();
    let mockResults = [];

    if (lowerQuery.includes('stamp duty') || lowerQuery.includes('tax')) {
      mockResults = [
        {
          title: 'Property Tax Guidelines 2024',
          snippet: 'Stamp duty for deeds of gift is currently set at 3% for the first... The standard rate for transfer is 4%.',
          source: 'Tax_Circular_2024.pdf'
        },
        {
          title: 'Gift Tax Exemptions',
          snippet: 'Transfers between immediate family members may be eligible for... subject to specific conditions outlined in Section 15.',
          source: 'Legal_Manual_v2.pdf'
        }
      ];
    } else if (lowerQuery.includes('foreigner') || lowerQuery.includes('foreign') || lowerQuery.includes('rent')) {
      mockResults = [
        {
          title: 'Foreign Ownership Regulations',
          snippet: 'Foreign nationals are permitted to purchase apartments from the 4th floor and above... Land purchase requires a 100% tax unless bought via a company.',
          source: 'Foreign_Investment_Act.pdf'
        },
        {
          title: 'Leasing to Expats',
          snippet: 'Standard lease agreements for foreign diplomats must include the diplomatic clause... Security deposit is typically 3 months.',
          source: 'Lease_Policy_Internal.pdf'
        }
      ];
    } else {
      mockResults = [
         {
          title: 'General Agency Guidelines',
          snippet: 'Please consult the specific department head for queries regarding... This matches your search for "'+  query +'" in our general index.',
          source: 'Employee_Handbook.pdf'
        },
      ];
    }

    setResults(mockResults);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-8 text-center pt-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Agent Brain 🧠</h1>
        <p className="text-gray-500 text-lg">Your AI-powered internal knowledge base. Ask anything.</p>
      </div>

      <div className="max-w-2xl mx-auto w-full mb-10">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What is the stamp duty for a deed of gift?"
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-black focus:border-transparent text-lg transition-all focus:shadow-md"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <button 
            type="submit" 
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Ask'}
          </button>
        </form>
      </div>

      <div className="flex-1">
        {results && (
          <div className="space-y-4 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Found {results.length} relevant sources</h3>
            {results.map((result, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {result.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      ...{result.snippet}...
                    </p>
                    <div className="flex items-center text-xs text-gray-400 gap-2">
                       <FileText className="w-3 h-3" />
                       <span>{result.source}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!results && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50">
             <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium">Legal Documents</p>
             </div>
             <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium">Tax Circulars</p>
             </div>
             <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium">Property Acts</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
