import React from 'react';
import { WeatherData } from '../types/weather';
import { getWeatherEmoji } from '../utils/weatherUtils';

interface WeatherAnimationProps {
  weatherData: WeatherData | null;
}

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ weatherData }) => {
  const getWeatherGifUrl = () => {
    if (!weatherData) return null;
    
    const condition = weatherData.current.condition.text.toLowerCase();
    const isDay = weatherData.current.is_day;

    if (condition.includes('rain') || condition.includes('shower')) {
      return 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXp4aHBheHl4NW45ZzZkdHJmN280MTl1ZTM5eHJ6OHZ4OHF5amtobyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dI3D3BWfDub0Q/giphy.gif';
    }
  };

  const gifUrl = getWeatherGifUrl();
  
  if (!gifUrl) {
    return (
      <div className="relative w-full h-48 overflow-hidden rounded-xl bg-gradient-to-b from-blue-300 to-blue-500 flex items-center justify-center">
        <div className="text-white text-lg">Loading weather animation...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-xl bg-gradient-to-b from-blue-200 to-blue-400">
      <img 
        src={gifUrl}
        alt={`${weatherData?.current.condition.text} weather animation`}
        className="w-full h-full object-cover rounded-xl opacity-90 mix-blend-multiply"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.innerHTML = `
            <div class="w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 rounded-xl">
              <div class="text-white text-center">
                <div class="text-4xl mb-2">${getWeatherEmoji(weatherData?.current.condition.text || '')}</div>
                <div class="text-sm">${weatherData?.current.condition.text}</div>
              </div>
            </div>
          `;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
      <div className="absolute bottom-4 left-4 text-white">
        <div className="text-2xl mb-1">{getWeatherEmoji(weatherData?.current.condition.text || '')}</div>
        <div className="text-sm font-medium bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
          {weatherData?.current.condition.text}
        </div>
      </div>
    </div>
  );
};