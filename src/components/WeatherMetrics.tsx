import React from 'react';
import { Droplets, Wind, Thermometer } from 'lucide-react';
import { WeatherData } from '../types/weather';

interface WeatherMetricsProps {
  weatherData: WeatherData;
}

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ weatherData }) => (
  <div className="grid grid-cols-3 gap-4">
    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
      <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-2" />
      <div className="text-xs text-gray-400 mb-1">Precipitation</div>
      <div className="font-semibold">{weatherData.current.precip_mm} mm</div>
    </div>
    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
      <Wind className="w-5 h-5 text-green-400 mx-auto mb-2" />
      <div className="text-xs text-gray-400 mb-1">Humidity</div>
      <div className="font-semibold">{weatherData.current.humidity}%</div>
    </div>
    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
      <Thermometer className="w-5 h-5 text-orange-400 mx-auto mb-2" />
      <div className="text-xs text-gray-400 mb-1">Wind</div>
      <div className="font-semibold">{weatherData.current.wind_kph} km/h</div>
    </div>
  </div>
);