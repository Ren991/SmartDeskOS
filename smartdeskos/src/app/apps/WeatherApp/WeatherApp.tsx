"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Droplets, Wind, MapPin } from "lucide-react";

interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  forecast: DailyForecast[];
}

interface SearchSuggestion {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export default function WeatherApp() {
  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (cityInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            cityInput
          )}&count=5&language=es&format=json`
        );
        const data = await res.json();
        if (data.results) {
          setSuggestions(data.results);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Error al buscar sugerencias", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [cityInput]);

  const fetchWeather = async (
    lat: number,
    lon: number,
    cityName: string,
    country: string = ""
  ) => {
    setLoading(true);
    setError(null);
    setShowSuggestions(false);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const data = await res.json();

      const forecastData: DailyForecast[] = data.daily.time
        .slice(0, 3)
        .map((timeStr: string, index: number) => ({
          date: timeStr,
          maxTemp: Math.round(data.daily.temperature_2m_max[index]),
          minTemp: Math.round(data.daily.temperature_2m_min[index]),
          weatherCode: data.daily.weather_code[index],
        }));

      setWeather({
        city: cityName,
        country: country,
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        weatherCode: data.current.weather_code,
        forecast: forecastData,
      });
      setCityInput("");
    } catch (err) {
      setError("No se pudo obtener el clima.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(-32.94682, -60.63932, "Rosario", "Argentina");
  }, []);

  const getWeatherEmoji = (code: number) => {
    if (code === 0) return "☀️";
    if (code >= 1 && code <= 3) return "⛅";
    if (code >= 45 && code <= 48) return "🌫️";
    if (code >= 51 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 80 && code <= 82) return "🌦️";
    if (code >= 95) return "⛈️";
    return "🌤️";
  };

  const getDayLabel = (index: number, dateStr: string) => {
    if (index === 0) return "Hoy";
    if (index === 1) return "Mañana";
    if (index === 2) return "Pasado";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-ES", { weekday: "short" });
  };

  return (
    // 🚀 AHORA TIENE `w-full h-full flex flex-col justify-between` PARA OCUPAR TODO EL ANCHO Y ALTO
    <div className="w-full h-full bg-zinc-950 text-white p-5 font-sans relative flex flex-col justify-between overflow-y-auto">
      {/* Buscador Superior */}
      <div>
        <div ref={searchRef} className="relative mb-4">
          <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 focus-within:border-blue-500 transition-colors">
            <Search size={16} className="text-zinc-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar ciudad (ej. Rosario)..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onFocus={() => cityInput.length >= 2 && setShowSuggestions(true)}
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
            />
          </div>

          {/* Desplegable de Autocompletado */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-48 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    fetchWeather(
                      item.latitude,
                      item.longitude,
                      item.name,
                      item.country
                    )
                  }
                  className="w-full px-3 py-2.5 text-left text-xs hover:bg-white/10 flex items-center justify-between transition-colors border-b border-white/5 last:border-none"
                >
                  <span className="font-medium text-zinc-200">{item.name}</span>
                  <span className="text-[10px] text-zinc-400">
                    {item.admin1 ? `${item.admin1}, ` : ""}
                    {item.country}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Carga / Error */}
        {loading && (
          <div className="text-center py-12 text-zinc-400 text-xs animate-pulse">
            Consultando el clima 🌤️...
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-8 text-red-400 text-xs">{error}</div>
        )}

        {/* Clima Actual */}
        {weather && !loading && !error && (
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mt-1">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-1.5">
                <MapPin size={18} className="text-red-400" />
                {weather.city}
              </h2>
              <p className="text-xs text-zinc-400">{weather.country}</p>
            </div>

            {/* Temperatura actual */}
            <div className="my-4 flex items-center justify-center gap-3">
              <span className="text-5xl">
                {getWeatherEmoji(weather.weatherCode)}
              </span>
              <span className="text-5xl font-extrabold tracking-tight">
                {weather.temp}°C
              </span>
            </div>

            {/* Métricas: Humedad y Viento */}
            <div className="grid grid-cols-2 gap-3 my-2 text-xs">
              <div className="flex items-center gap-2.5 bg-zinc-900/80 p-3 rounded-xl border border-white/5">
                <Droplets className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-zinc-500 text-[10px]">Humedad</p>
                  <p className="font-semibold text-zinc-200">
                    {weather.humidity}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-zinc-900/80 p-3 rounded-xl border border-white/5">
                <Wind className="w-4 h-4 text-teal-400" />
                <div>
                  <p className="text-zinc-500 text-[10px]">Viento</p>
                  <p className="font-semibold text-zinc-200">
                    {weather.windSpeed} km/h
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pronóstico 3 días (Alineado abajo) */}
      {weather && !loading && !error && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-[10px] uppercase font-semibold text-zinc-400 mb-2 tracking-wider">
            Pronóstico Extendido 📅
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {weather.forecast.map((day, idx) => (
              <div
                key={day.date}
                className="bg-zinc-900/60 p-2.5 rounded-xl border border-white/5 flex flex-col items-center justify-center"
              >
                <span className="text-xs font-medium text-zinc-300">
                  {getDayLabel(idx, day.date)}
                </span>
                <span className="text-xl my-1">
                  {getWeatherEmoji(day.weatherCode)}
                </span>
                <div className="text-[11px] font-semibold">
                  <span className="text-zinc-100">{day.maxTemp}°</span>{" "}
                  <span className="text-zinc-500">{day.minTemp}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}