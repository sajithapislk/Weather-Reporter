'use client';

import { useState, useEffect } from 'react';
import { WeatherData, WeatherApiResponse } from '../types/weather';
import { CloudSun, AlertTriangle, RefreshCw } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import WeatherCard from '@/components/WeatherCard';

const DEFAULT_LOCATION = 'Colombo, Sri Lanka';

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>(DEFAULT_LOCATION);

  const fetchWeather = async (location: string = DEFAULT_LOCATION) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/weather?location=${encodeURIComponent(location)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: WeatherApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch weather data');
      }
      
      if (!result.data) {
        throw new Error('No weather data received');
      }
      
      setWeatherData(result.data);
      setCurrentLocation(location);
      
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred while fetching weather data'
      );
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(DEFAULT_LOCATION);
  }, []);

  const handleSearch = (location: string) => {
    if (location.trim()) {
      fetchWeather(location.trim());
    }
  };

  const handleRetry = () => {
    fetchWeather(currentLocation);
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
          Get real-time weather information for any city worldwide. 
          Start with Colombo, Sri Lanka or search for your location.
        </p>
      </div>

      <SearchBar 
        onSearch={handleSearch} 
        isLoading={loading}
        placeholder="Enter city name (e.g., London, Tokyo, New York)"
      />

      <div className="flex justify-center">
        {loading ? (
          <div className="w-full max-w-4xl">
            <LoadingSpinner 
              size="lg" 
              text="Fetching weather data..." 
              className="py-12"
            />
          </div>
        ) : error ? (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                  Weather Data Unavailable
                </h3>
              </div>
              <p className="text-red-700 dark:text-red-400 mb-4">
                {error}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRetry}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 px-4 py-2 
                           bg-red-600 hover:bg-red-700 disabled:bg-red-400
                           text-white rounded-lg transition-colors duration-200
                           disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => handleSearch(DEFAULT_LOCATION)}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 px-4 py-2 
                           bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                           text-white rounded-lg transition-colors duration-200
                           disabled:cursor-not-allowed"
                >
                  <CloudSun className="h-4 w-4" />
                  <span>Load Default (Colombo)</span>
                </button>
              </div>
            </div>
          </div>
        ) : weatherData ? (
          <WeatherCard weatherData={weatherData} />
        ) : (
          <div className="w-full max-w-2xl mx-auto text-center py-12">
            <CloudSun className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Weather Data
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Search for a city to get started
            </p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
          About This Application
        </h3>
        <div className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
          <p>
            This weather application demonstrates modern web development practices using 
            Next.js 14, TypeScript, and Tailwind CSS. It securely fetches real-time weather 
            data through server-side API routes.
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
              WeatherAPI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}