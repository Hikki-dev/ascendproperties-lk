"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [type, setType] = useState('All Types');

  const handleSearch = () => {
    // We'll pass the search terms as URL params
    const query = `?location=${location}&type=${type}`;
    router.push(`/search${query}`);
  };

  return (
    <div className="search-bar">
      <input 
        type="text" 
        placeholder="Search by location..." 
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      {/* ... your other dropdowns ... */}
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}