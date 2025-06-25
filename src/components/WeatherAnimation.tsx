import React, { useState } from 'react';
import Image from 'next/image';
import { WeatherData } from '../types/weather';
import { getWeatherEmoji } from '../utils/weatherUtils';

interface WeatherAnimationProps {
  weatherData: WeatherData | null;
}

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ weatherData }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getWeatherGifUrl = () => {
    if (!weatherData) return null;
    
    const condition = weatherData.current.condition.text.toLowerCase();

    if (condition.includes('rain') || condition.includes('shower')) {
      return 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXp4aHBheHl4NW45ZzZkdHJmN280MTl1ZTM5eHJ6OHZ4OHF5amtobyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dI3D3BWfDub0Q/giphy.gif';
    }
    return null;
  };

  const gifUrl = getWeatherGifUrl();
  
  // Fallback UI when no GIF URL or image failed to load
  if (!gifUrl || imageError) {
    return (
      <div className="relative w-full h-48 overflow-hidden rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-2">{getWeatherEmoji(weatherData?.current.condition.text || '')}</div>
          <div className="text-sm">{weatherData?.current.condition.text || 'Loading weather...'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-xl bg-gradient-to-b from-blue-200 to-blue-400">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500 rounded-xl">
          <div className="text-white text-lg">Loading weather animation...</div>
        </div>
      )}
      
      <Image 
        src={gifUrl}
        alt={`${weatherData?.current.condition.text} weather animation`}
        fill
        className="object-cover rounded-xl opacity-90 mix-blend-multiply"
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        unoptimized // Add this for GIFs to preserve animation
      />
      
      {!imageLoading && !imageError && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-2xl mb-1">{getWeatherEmoji(weatherData?.current.condition.text || '')}</div>
            <div className="text-sm font-medium bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
              {weatherData?.current.condition.text}
            </div>
          </div>
        </>
      )}
    </div>
  );
};