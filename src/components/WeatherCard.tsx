import React from 'react';
import { WeatherData } from '../types/weather';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Eye, 
  Gauge,
  MapPin,
  Clock
} from 'lucide-react';

interface WeatherCardProps {
  weatherData: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  const { location, current } = weatherData;

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateString;
    }
  };

  const getUVInfo = (uvIndex: number) => {
    if (uvIndex <= 2) return { color: 'text-green-600', desc: 'Low' };
    if (uvIndex <= 5) return { color: 'text-yellow-600', desc: 'Moderate' };
    if (uvIndex <= 7) return { color: 'text-orange-600', desc: 'High' };
    if (uvIndex <= 10) return { color: 'text-red-600', desc: 'Very High' };
    return { color: 'text-purple-600', desc: 'Extreme' };
  };

  const uvInfo = getUVInfo(current.uv);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <div>
                <h1 className="text-2xl font-bold">
                  {location.name}
                </h1>
                <p className="text-blue-100 text-sm">
                  {location.region && `${location.region}, `}{location.country}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-blue-100 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>Last updated</span>
              </div>
              <p className="text-xs text-blue-100">
                {formatTime(current.last_updated)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={`https:${current.condition.icon}`} 
                alt={current.condition.text}
                className="w-20 h-20"
              />
              <div>
                <div className="text-5xl font-bold text-gray-800 dark:text-white">
                  {Math.round(current.temp_c)}°C
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  {Math.round(current.temp_f)}°F
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Feels like {Math.round(current.feelslike_c)}°C
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {current.condition.text}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {current.is_day ? '☀️ Daytime' : '🌙 Nighttime'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Weather Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-2 mb-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Temperature
                </span>
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {Math.round(current.temp_c)}°C
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(current.temp_f)}°F
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Humidity
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {current.humidity}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Relative humidity
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-2">
                <Wind className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Wind Speed
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {current.wind_kph} km/h
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {current.wind_dir} • {current.wind_mph} mph
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2 mb-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  UV Index
                </span>
              </div>
              <div className={`text-2xl font-bold ${uvInfo.color}`}>
                {current.uv}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {uvInfo.desc}
              </div>
            </div>

          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Additional Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Visibility:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {current.vis_km} km
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Gauge className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Pressure:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {current.pressure_mb} mb
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Droplets className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Precipitation:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {current.precip_mm} mm
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Wind Gust:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {current.gust_kph} km/h
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Cloud Cover:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {current.cloud}%
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Coordinates:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default WeatherCard;