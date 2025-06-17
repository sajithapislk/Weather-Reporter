import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchBarProps {
  onSearch: (location: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

interface LocationSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading, 
  placeholder = "Enter city name (e.g., Colombo, Kandy, Galle)" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const popularCities = [
    'Colombo, Sri Lanka',
    'Galle, Sri Lanka',
    'Kandy, Sri Lanka',
    'Anuradhapura, Sri Lanka',
    'Jaffna, Sri Lanka',
  ];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch location suggestions
  useEffect(() => {
    if (searchTerm.trim().length > 2 && !isLoading) {
      const timer = setTimeout(() => {
        fetchSuggestions(searchTerm.trim());
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, isLoading]);

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm && !isLoading) {
      onSearch(trimmedTerm);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (selectedSuggestionIndex >= 0 && suggestions.length > 0) {
        const selected = suggestions[selectedSuggestionIndex];
        const fullLocation = `${selected.name}, ${selected.country}`;
        setSearchTerm(fullLocation);
        onSearch(fullLocation);
        setShowSuggestions(false);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : 0
      );
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleQuickSearch = (location: string) => {
    setSearchTerm(location);
    onSearch(location);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const fullLocation = `${suggestion.name}, ${suggestion.country}`;
    setSearchTerm(fullLocation);
    onSearch(fullLocation);
    setShowSuggestions(false);
  };

  const toggleSuggestions = () => {
    if (searchTerm.trim().length > 0) {
      setShowSuggestions(!showSuggestions);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8" ref={searchBarRef}>
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedSuggestionIndex(-1);
          }}
          onKeyDown={handleKeyPress}
          onFocus={() => searchTerm.trim().length > 2 && setShowSuggestions(true)}
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
          onClick={toggleSuggestions}
          disabled={!searchTerm.trim() || isLoading}
          className="absolute inset-y-0 right-10 pr-3 flex items-center
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-50 dark:hover:bg-gray-700
                   transition-colors duration-200"
          aria-label="Toggle suggestions"
        >
          {showSuggestions ? (
            <ChevronUp className="h-5 w-5 text-gray-400 hover:text-blue-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400 hover:text-blue-500" />
          )}
        </button>
        
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

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg 
                          border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.id}-${suggestion.name}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 
                             ${selectedSuggestionIndex === index ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {suggestion.region}, {suggestion.country}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
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