import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  CloudSun,
  LucideProps
} from 'lucide-react';
import React from 'react';

export const getWeatherIcon = (condition: string): React.ReactElement => {
  const conditionLower = condition.toLowerCase();
  const commonProps: LucideProps = {
    className: "w-8 h-8",
    size: 32,
  };

  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return <Sun {...commonProps} className={`${commonProps.className} text-yellow-400`} />;
  }
  if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    return <CloudRain {...commonProps} className={`${commonProps.className} text-blue-400`} />;
  }
  if (conditionLower.includes('thunder')) {
    return <CloudRain {...commonProps} className={`${commonProps.className} text-purple-500`} />;
  }
  if (conditionLower.includes('snow')) {
    return <CloudSnow {...commonProps} className={`${commonProps.className} text-blue-200`} />;
  }
  if (conditionLower.includes('wind')) {
    return <Wind {...commonProps} className={`${commonProps.className} text-gray-400`} />;
  }
  if (conditionLower.includes('cloud')) {
    return <Cloud {...commonProps} className={`${commonProps.className} text-gray-400`} />;
  }
  return <CloudSun {...commonProps} className={`${commonProps.className} text-gray-300`} />;
};

export const getWeatherEmoji = (condition: string): string => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀️';
  if (conditionLower.includes('cloud')) return '☁️';
  if (conditionLower.includes('rain') || conditionLower.includes('shower')) return '🌧️';
  if (conditionLower.includes('thunder')) return '⛈️';
  if (conditionLower.includes('snow')) return '❄️';
  return '⛅';
};