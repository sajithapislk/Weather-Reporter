// src/app/api/weather/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WeatherData, WeatherError } from '../../../types/weather';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1';

export async function GET(request: NextRequest) {
  if (!WEATHER_API_KEY) {
    console.error('WEATHER_API_KEY is not configured');
    return NextResponse.json(
      {
        success: false,
        error: 'Weather API is not configured properly'
      },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'Colombo, Sri Lanka';

  if (!location || typeof location !== 'string') {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid location parameter'
      },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `${WEATHER_API_BASE_URL}/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&aqi=no`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData: WeatherError = await response.json();
      console.error('Weather API Error:', errorData);
      
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to fetch weather data'
        },
        { status: response.status }
      );
    }

    const weatherData: WeatherData = await response.json();

    if (!weatherData.current || !weatherData.location) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid weather data received'
        },
        { status: 500 }
      );
    }

    const responseHeaders = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60', // Cache for 5 minutes
      'Content-Type': 'application/json',
    };

    return NextResponse.json(
      {
        success: true,
        data: weatherData
      },
      { 
        status: 200,
        headers: responseHeaders
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Request timeout. Please try again.'
        },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error. Please try again later.'
      },
      { status: 500 }
    );
  }
}

