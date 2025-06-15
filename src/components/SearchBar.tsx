import React, { useState, KeyboardEvent } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (location: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading, 
  placeholder = "Enter city name (e.g., Colombo, Kandy, Galle)" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm && !isLoading) {
      onSearch(trimmedTerm);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuickSearch = (location: string) => {
    setSearchTerm(location);
    onSearch(location);
  };

  const popularCities = [
    'Colombo, Sri Lanka',
    'Galle, Sri Lanka',
    'Kandy, Sri Lanka',
    'Anuradhapura, Sri Lanka',
    'Jaffna, Sri Lanka',
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                   bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   placeholder-gray-500 text-sm sm:text-base
                   shadow-sm hover:shadow-md transition-shadow duration-200"
        />
        
        <button
          onClick={handleSearch}
          disabled={!searchTerm.trim() || isLoading}
          className="absolute inset-y-0 right-0 pr-3 flex items-center
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r-lg
                   transition-colors duration-200"
          aria-label="Search weather"
        >
          <Search className="h-5 w-5 text-gray-400 hover:text-blue-500" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2 self-center">
          Quick search:
        </span>
        {popularCities.map((city) => (
          <button
            key={city}
            onClick={() => handleQuickSearch(city)}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 
                     text-gray-700 dark:text-gray-300 rounded-full
                     hover:bg-blue-100 dark:hover:bg-blue-900 
                     hover:text-blue-700 dark:hover:text-blue-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200 border border-transparent
                     hover:border-blue-200 dark:hover:border-blue-700"
          >
            {city.split(',')[0]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;