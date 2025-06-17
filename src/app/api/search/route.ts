import { NextRequest, NextResponse } from 'next/server';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1';

export async function GET(request: NextRequest) {
  if (!WEATHER_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Weather API is not configured properly' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.length < 3) {
    return NextResponse.json(
      { success: false, error: 'Query must be at least 3 characters long' },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `${WEATHER_API_BASE_URL}/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, error: errorData.error?.message || 'Failed to fetch suggestions' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    const suggestions = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      region: item.region,
      country: item.country,
    }));

    return NextResponse.json(
      { success: true, suggestions },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}