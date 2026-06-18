const https = require('https');
const http = require('http');

/**
 * Fetch weather data from Open-Meteo API (free, no API key required)
 */
async function fetchFromOpenMeteo(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (resp) => {
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Failed to parse weather data')); }
      });
    }).on('error', reject);
  });
}

// WMO Weather Code descriptions
const WMO_CODES = {
  0: { desc: 'Clear sky', icon: '☀️', severity: 'safe' },
  1: { desc: 'Mainly clear', icon: '🌤️', severity: 'safe' },
  2: { desc: 'Partly cloudy', icon: '⛅', severity: 'safe' },
  3: { desc: 'Overcast', icon: '☁️', severity: 'safe' },
  45: { desc: 'Fog', icon: '🌫️', severity: 'caution' },
  48: { desc: 'Depositing rime fog', icon: '🌫️', severity: 'caution' },
  51: { desc: 'Light drizzle', icon: '🌦️', severity: 'caution' },
  53: { desc: 'Moderate drizzle', icon: '🌦️', severity: 'caution' },
  55: { desc: 'Dense drizzle', icon: '🌧️', severity: 'warning' },
  61: { desc: 'Slight rain', icon: '🌧️', severity: 'caution' },
  63: { desc: 'Moderate rain', icon: '🌧️', severity: 'warning' },
  65: { desc: 'Heavy rain', icon: '🌧️', severity: 'danger' },
  71: { desc: 'Slight snow', icon: '🌨️', severity: 'caution' },
  73: { desc: 'Moderate snow', icon: '🌨️', severity: 'warning' },
  75: { desc: 'Heavy snow', icon: '❄️', severity: 'danger' },
  77: { desc: 'Snow grains', icon: '🌨️', severity: 'caution' },
  80: { desc: 'Slight rain showers', icon: '🌦️', severity: 'caution' },
  81: { desc: 'Moderate rain showers', icon: '🌧️', severity: 'warning' },
  82: { desc: 'Violent rain showers', icon: '⛈️', severity: 'danger' },
  85: { desc: 'Slight snow showers', icon: '🌨️', severity: 'caution' },
  86: { desc: 'Heavy snow showers', icon: '❄️', severity: 'danger' },
  95: { desc: 'Thunderstorm', icon: '⛈️', severity: 'danger' },
  96: { desc: 'Thunderstorm with slight hail', icon: '⛈️', severity: 'danger' },
  99: { desc: 'Thunderstorm with heavy hail', icon: '⛈️', severity: 'danger' }
};

function getWeatherInfo(code) {
  return WMO_CODES[code] || { desc: 'Unknown', icon: '❓', severity: 'safe' };
}

const getWeatherForecast = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: 'lat and lng are required' });
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max&timezone=auto&forecast_days=7`;

    const data = await fetchFromOpenMeteo(url);

    if (!data.daily) {
      return res.status(502).json({ message: 'Unable to fetch weather data' });
    }

    const daily = data.daily;
    const forecast = daily.time.map((date, i) => {
      const weatherCode = daily.weather_code[i];
      const info = getWeatherInfo(weatherCode);
      const tempMax = daily.temperature_2m_max[i];
      const windMax = daily.wind_speed_10m_max[i];

      // Generate alerts
      const alerts = [];
      if (info.severity === 'danger') {
        alerts.push({ type: 'danger', message: `⚠ ${info.desc} Expected` });
      } else if (info.severity === 'warning') {
        alerts.push({ type: 'warning', message: `⚠ ${info.desc} Expected` });
      }
      if (tempMax >= 42) {
        alerts.push({ type: 'danger', message: '⚠ Extreme Heat Alert — Temperature above 42°C' });
      } else if (tempMax >= 38) {
        alerts.push({ type: 'warning', message: '⚠ High Temperature Alert — Temperature above 38°C' });
      }
      if (windMax >= 60) {
        alerts.push({ type: 'danger', message: '⚠ Strong Wind Warning — Wind speed above 60 km/h' });
      } else if (windMax >= 40) {
        alerts.push({ type: 'warning', message: '⚠ Windy Conditions — Wind speed above 40 km/h' });
      }
      if (daily.precipitation_sum[i] >= 50) {
        alerts.push({ type: 'danger', message: '⚠ Flood Risk — Heavy precipitation expected' });
      }

      return {
        date,
        weather_code: weatherCode,
        description: info.desc,
        icon: info.icon,
        severity: info.severity,
        temp_max: tempMax,
        temp_min: daily.temperature_2m_min[i],
        precipitation: daily.precipitation_sum[i],
        wind_speed_max: windMax,
        uv_index: daily.uv_index_max[i],
        alerts,
        safe_for_outdoor: info.severity === 'safe' && tempMax < 42 && windMax < 60
      };
    });

    res.json({
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      timezone: data.timezone,
      forecast
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWeatherAlerts = async (req, res) => {
  try {
    const { lat, lng, date } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: 'lat and lng are required' });
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=3`;
    const data = await fetchFromOpenMeteo(url);

    if (!data.daily) {
      return res.status(502).json({ message: 'Unable to fetch weather data' });
    }

    const daily = data.daily;
    const allAlerts = [];

    daily.time.forEach((d, i) => {
      if (date && d !== date) return; // filter to specific date if provided

      const info = getWeatherInfo(daily.weather_code[i]);
      const tempMax = daily.temperature_2m_max[i];
      const windMax = daily.wind_speed_10m_max[i];
      const precip = daily.precipitation_sum[i];

      if (info.severity === 'danger' || info.severity === 'warning') {
        allAlerts.push({ date: d, type: info.severity, message: `${info.icon} ${info.desc}`, category: 'weather' });
      }
      if (tempMax >= 38) {
        allAlerts.push({ date: d, type: tempMax >= 42 ? 'danger' : 'warning', message: `🌡️ High Temperature: ${tempMax}°C`, category: 'heat' });
      }
      if (windMax >= 40) {
        allAlerts.push({ date: d, type: windMax >= 60 ? 'danger' : 'warning', message: `💨 Strong Winds: ${windMax} km/h`, category: 'wind' });
      }
      if (precip >= 30) {
        allAlerts.push({ date: d, type: precip >= 50 ? 'danger' : 'warning', message: `🌊 Heavy Rain: ${precip}mm`, category: 'rain' });
      }
    });

    const shouldReschedule = allAlerts.some(a => a.type === 'danger');
    const suggestion = shouldReschedule
      ? 'We recommend rescheduling this outdoor job to a safer day.'
      : allAlerts.length > 0
        ? 'Proceed with caution — monitor weather conditions.'
        : 'Weather conditions look good for outdoor work!';

    res.json({ alerts: allAlerts, shouldReschedule, suggestion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWeatherForecast, getWeatherAlerts };
