import { ForecastData, WeatherData } from "./weather";

export interface WeatherApiResponse {
  success: boolean;
  data?: WeatherData | ForecastData;
  error?: string;
}
