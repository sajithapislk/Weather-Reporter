import { useState, useEffect, useCallback } from 'react';
import { WeatherData, ForecastData, ForecastDay } from '../types/weather';
import { getWeatherEmoji } from '../utils/weatherUtils';
import { WeatherApiResponse } from '@/types/weatherApiResponse';

export const useWeatherData = (initialLocation: string = 'Colombo, Sri Lanka') => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [hourlyData, setHourlyData] = useState<{
    temperature: number[];
    precipitation: number[];
    wind: number[];
  }>({ temperature: [], precipitation: [], wind: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (location: string = initialLocation) => {
    setLoading(true);
    setError(null);

    try {
      const currentResponse = await fetch(
        `/api/weather?location=${encodeURIComponent(location)}&type=current`
      );
      if (!currentResponse.ok) {
        throw new Error(`HTTP error! status: ${currentResponse.status}`);
      }
      const currentResult: WeatherApiResponse = await currentResponse.json();
      if (!currentResult.success || !currentResult.data) {
        throw new Error(currentResult.error || 'Failed to fetch current weather data');
      }
      setWeatherData(currentResult.data as WeatherData);

      const forecastResponse = await fetch(
        `/api/weather?location=${encodeURIComponent(location)}&type=forecast`
      );
      if (!forecastResponse.ok) {
        throw new Error(`HTTP error! status: ${forecastResponse.status}`);
      }
      const forecastResult: WeatherApiResponse = await forecastResponse.json();
      if (!forecastResult.success || !forecastResult.data) {
        throw new Error(forecastResult.error || 'Failed to fetch forecast data');
      }

      const forecastData = forecastResult.data as ForecastData;
      if (!forecastData.forecast?.forecastday) {
        throw new Error('Invalid forecast data received');
      }

      const forecast = forecastData.forecast.forecastday.map((day) => ({
        day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        temp_high: day.day.maxtemp_c,
        temp_low: day.day.mintemp_c,
        condition: day.day.condition.text.toLowerCase(),
        icon: getWeatherEmoji(day.day.condition.text),
      }));
      setForecastData(forecast);

      const hourly = forecastData.forecast.forecastday[0].hour
        .filter((_, index) => index % 3 === 0)
        .slice(0, 8);
      setHourlyData({
        temperature: hourly.map((hour) => hour.temp_c),
        precipitation: hourly.map((hour) => hour.precip_mm),
        wind: hourly.map((hour) => hour.wind_kph),
      });

      setLoading(false);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while fetching weather data'
      );
      setWeatherData(null);
      setLoading(false);
    }
  }, [initialLocation]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    weatherData,
    forecastData,
    hourlyData,
    loading,
    error,
    fetchWeather,
  };
};