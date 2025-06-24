'use client';

import React, { useState } from 'react';
import { CloudSun, AlertTriangle, RefreshCw } from 'lucide-react';
import { useWeatherData } from '../hooks/useWeatherData';
import { useTime } from '../hooks/useTime';
import LoadingSpinner from './LoadingSpinner';
import { WeatherMetrics } from './WeatherMetrics';
import { WeatherAnimation } from './WeatherAnimation';
import { WeatherChart } from './WeatherChart';
import { getWeatherIcon } from '../utils/weatherUtils';

interface WeatherCardProps {
  initialLocation?: string;
}
type MetricType = 'temperature' | 'precipitation' | 'wind';
const WeatherCard: React.FC<WeatherCardProps> = ({ initialLocation = 'Colombo, Sri Lanka' }) => {
  const currentTime = useTime();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('temperature');
  const {
    weatherData,
    forecastData,
    hourlyData,
    loading,
    error,
    fetchWeather,
  } = useWeatherData(initialLocation);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <LoadingSpinner size="lg" text="Fetching weather data..." className="py-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
              Weather Data Unavailable
            </h3>
          </div>
          <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => fetchWeather(initialLocation)}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-2 
                       bg-red-600 hover:bg-red-700 disabled:bg-red-400
                       text-white rounded-lg transition-colors duration-200
                       disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12">
        <CloudSun className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
          No Weather Data
        </h3>
        <p className="text-gray-500 dark:text-gray-500">Search for a city to get started</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-slate-900/40 to-slate-900"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="text-sm text-blue-300 mb-1">Results for</div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-light">{weatherData.location.name}</h1>
              <span className="text-sm text-gray-400">• Choose area</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-light">Weather</div>
            <div className="text-sm text-blue-300">{formatTime(currentTime)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  {weatherData && getWeatherIcon(weatherData.current.condition.text)}
                </div>
                <div>
                  <div className="text-6xl font-extralight">
                    {Math.round(weatherData.current.temp_c)}
                    <span className="text-2xl text-gray-400 ml-1">°C</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {Math.round(weatherData.current.temp_f)}°F
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium mb-2">
                  {weatherData.current.condition.text}
                </div>
                <div className="text-sm text-blue-300">
                  {weatherData.current.is_day ? '☀️ Day time' : '🌙 Night time'}
                </div>
              </div>
            </div>

            <WeatherMetrics weatherData={weatherData} />
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h3 className="text-lg font-medium mb-4">Live Weather Animation</h3>
            <WeatherAnimation weatherData={weatherData} />
            <div className="mt-4 text-sm text-gray-400 text-center">
              Real-time weather GIF visualization powered by open-source animations
            </div>
          </div>
        </div>

        <WeatherChart
          selectedMetric={selectedMetric}
          hourlyData={hourlyData}
          setSelectedMetric={setSelectedMetric}
        />

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h3 className="text-lg font-medium mb-6">7-Day Forecast</h3>
          <div className="grid grid-cols-7 gap-4">
            {forecastData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-gray-400 mb-2">{day.day}</div>
                <div className="w-12 h-12 mx-auto mb-3 bg-white/10 rounded-xl flex items-center justify-center text-2xl border border-white/20">
                  {day.icon}
                </div>
                <div className="text-sm font-medium mb-1">{day.temp_high}°</div>
                <div className="text-xs text-gray-400">{day.temp_low}°</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;