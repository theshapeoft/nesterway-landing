"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets } from "lucide-react";

interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    humidity: number;
  };
  daily: Array<{
    date: string;
    dayName: string;
    tempMax: number;
    tempMin: number;
    weatherCode: number;
  }>;
}

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
  locationName?: string;
  className?: string;
}

// Weather code to icon mapping based on WMO codes
function getWeatherIcon(code: number, size: "sm" | "lg" = "sm") {
  const iconClass = size === "lg" ? "h-10 w-10" : "h-5 w-5";
  
  // Clear
  if (code === 0 || code === 1) {
    return <Sun className={`${iconClass} text-yellow-500`} />;
  }
  // Partly cloudy
  if (code === 2 || code === 3) {
    return <Cloud className={`${iconClass} text-gray-400`} />;
  }
  // Fog
  if (code >= 45 && code <= 48) {
    return <Cloud className={`${iconClass} text-gray-300`} />;
  }
  // Drizzle or rain
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return <CloudRain className={`${iconClass} text-blue-400`} />;
  }
  // Snow
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return <CloudSnow className={`${iconClass} text-blue-200`} />;
  }
  // Thunderstorm
  if (code >= 95 && code <= 99) {
    return <CloudLightning className={`${iconClass} text-purple-400`} />;
  }
  // Default
  return <Cloud className={`${iconClass} text-gray-400`} />;
}

function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 56 && code <= 57) return "Freezing drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 66 && code <= 67) return "Freezing rain";
  if (code >= 71 && code <= 75) return "Snow";
  if (code === 77) return "Snow grains";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code === 95) return "Thunderstorm";
  if (code >= 96 && code <= 99) return "Thunderstorm with hail";
  return "Unknown";
}

function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function WeatherWidget({ latitude, longitude, locationName, className }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Open-Meteo API - free, no key required
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch weather");
        
        const data = await response.json();
        
        setWeather({
          current: {
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code,
            windSpeed: Math.round(data.current.wind_speed_10m),
            humidity: data.current.relative_humidity_2m,
          },
          daily: data.daily.time.slice(0, 4).map((date: string, i: number) => ({
            date,
            dayName: getDayName(date),
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            weatherCode: data.daily.weather_code[i],
          })),
        });
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Unable to load weather");
      } finally {
        setLoading(false);
      }
    }

    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className={`mx-4 ${className || ""}`}>
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card/50 p-4">
          <div className="flex items-center justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return null; // Silently fail - weather is a nice-to-have
  }

  return (
    <div className={`mx-4 ${className || ""}`}>
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-gradient-to-br from-card to-card/80 p-4">
        {/* Current Weather */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.current.weatherCode, "lg")}
            <div>
              <div className="text-3xl font-bold text-foreground">
                {weather.current.temperature}°C
              </div>
              <div className="text-sm text-muted-foreground">
                {getWeatherDescription(weather.current.weatherCode)}
              </div>
            </div>
          </div>
          <div className="text-right">
            {locationName && (
              <div className="text-sm font-medium text-foreground">{locationName}</div>
            )}
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Wind className="h-3 w-3" />
                {weather.current.windSpeed} km/h
              </span>
              <span className="flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                {weather.current.humidity}%
              </span>
            </div>
          </div>
        </div>

        {/* 4-day Forecast */}
        <div className="grid grid-cols-4 gap-2 border-t border-border pt-3">
          {weather.daily.map((day) => (
            <div
              key={day.date}
              className="flex flex-col items-center rounded-lg bg-muted/30 p-2 text-center"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {day.dayName}
              </span>
              <div className="my-1">{getWeatherIcon(day.weatherCode)}</div>
              <div className="text-xs">
                <span className="font-medium text-foreground">{day.tempMax}°</span>
                <span className="text-muted-foreground"> / {day.tempMin}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
