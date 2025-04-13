'use client';

import { useState, useMemo } from 'react';
import { birminghamNumbers, BirminghamNumber } from '../data/birminghamNumbers';

export default function BirminghamNumbersSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(birminghamNumbers.map(item => item.category)));
  }, []);

  // Filter numbers based on search query and category
  const filteredNumbers = useMemo(() => {
    return birminghamNumbers.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.number.includes(searchQuery);
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Birmingham Useful Numbers</h2>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for services or numbers..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Results - Only show when searching */}
      {(searchQuery || selectedCategory) && (
        <div className="space-y-4">
          {filteredNumbers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No results found</p>
          ) : (
            filteredNumbers.map((item) => (
              <div key={item.name} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blue-600">{item.number}</p>
                    <span className="text-xs text-gray-400">{item.category}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Help text when no search */}
      {!searchQuery && !selectedCategory && (
        <div className="text-center py-4">
          <p className="text-gray-500">Start typing to search for useful numbers</p>
          <p className="text-sm text-gray-400 mt-2">You can search by service name, description, or number</p>
        </div>
      )}
    </div>
  );
} 