import React, { useState } from 'react';

const Topbar = ({ title }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality here
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bills, customers, reports..."
              className="pl-10 pr-4 py-2 w-48 md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-xl">💬</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;