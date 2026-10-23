const axios = require('axios');
const config = require('../config');

const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function cacheKey(lat, lon) {
  return `${Number(lat).toFixed(2)}:${Number(lon).toFixed(2)}`;
}

function demoWeather(lat, lon) {
  const seed = Math.abs(Math.sin(Number(lat) * 12.9898 + Number(lon) * 78.233)) * 10000;
  const rainfall = Math.round((seed % 180) + 5);
  const humidity = Math.round(55 + (seed % 40));
  const temperature = Math.round(24 + (seed % 12));
  const windSpeed = Math.round(5 + (seed % 25));
  const pressure = Math.round(995 + (seed % 25));

  return {
    temperature,
    humidity,
    rainfall,
    windSpeed,
    pressure,
    weatherDescription: rainfall > 80 ? 'Heavy rain (DEMO)' : 'Partly cloudy (DEMO)',
    timestamp: new Date().toISOString(),
    location: { latitude: Number(lat), longitude: Number(lon) },
    source: 'DEMO',
    message: 'Simulated weather for demonstration. Add WEATHER_API_KEY for live OpenWeatherMap data.',
  };
}

async function getCurrentWeather(lat, lon) {
  const key = cacheKey(lat, lon);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.data;
  }

  if (config.weatherDemoMode || !config.weatherApiKey) {
    const data = demoWeather(lat, lon);
    cache.set(key, { at: Date.now(), data });
    return data;
  }

  try {
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const { data } = await axios.get(url, {
      params: { lat, lon, appid: config.weatherApiKey, units: 'metric' },
      timeout: 10000,
    });

    const rainfall =
      data.rain?.['1h'] ?? data.rain?.['3h'] ?? data.snow?.['1h'] ?? 0;

    const result = {
      temperature: data.main?.temp ?? null,
      humidity: data.main?.humidity ?? null,
      rainfall,
      windSpeed: data.wind?.speed ?? null,
      pressure: data.main?.pressure ?? null,
      weatherDescription: data.weather?.[0]?.description || 'Unknown',
      timestamp: new Date().toISOString(),
      location: { latitude: Number(lat), longitude: Number(lon) },
      source: 'LIVE',
    };

    cache.set(key, { at: Date.now(), data: result });
    return result;
  } catch (error) {
    const fallback = demoWeather(lat, lon);
    fallback.message =
      'Live weather unavailable (API key may still be activating — new OpenWeatherMap keys can take up to 2 hours). Showing DEMO data.';
    fallback.fallbackReason = error.response?.data?.message || error.message;
    cache.set(key, { at: Date.now(), data: fallback });
    return fallback;
  }
}

module.exports = { getCurrentWeather };
