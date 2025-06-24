'use client';

import { useState, useEffect } from 'react';
import { CloudSun} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import WeatherCard from '@/components/WeatherCard';

const DEFAULT_LOCATION = 'Colombo, Sri Lanka';

export default function HomePage() {
  const [currentLocation, setCurrentLocation] = useState<string>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cachedLocation = localStorage.getItem('lastLocation');
    setCurrentLocation(cachedLocation || DEFAULT_LOCATION);
    setLoading(false);
  }, []);

  const handleSearch = (location: string) => {
    if (location.trim()) {
      setCurrentLocation(location.trim());
      localStorage.setItem('lastLocation', location.trim());
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <CloudSun className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Weather Reporter
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get real-time weather information with a stunning 3D dashboard. Start with Colombo, Sri Lanka or search for your location.
        </p>
      </div>

      <SearchBar
        onSearch={handleSearch}
        isLoading={loading}
        placeholder="Enter city name (e.g., London, Tokyo, New York)"
      />

      {loading ? (
        <div className="w-full max-w-4xl mx-auto">
          <LoadingSpinner size="lg" text="Fetching weather data..." className="py-12" />
        </div>
      ) : (
        <WeatherCard initialLocation={currentLocation} />
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
          About This Application
        </h3>
        <div className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
          <p>
            This weather application features a 3D weather visualization built with Next.js 14, TypeScript, Three.js, and Tailwind CSS. It fetches real-time weather data using WeatherAPI.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              Next.js 14
            </span>
            <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              TypeScript
            </span>
            <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              Tailwind CSS
            </span>
            <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              Three.js
            </span>
            <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              WeatherAPI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}