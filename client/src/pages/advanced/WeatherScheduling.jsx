import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import WeatherCard from '../../components/advanced/WeatherCard';

const WeatherScheduling = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Default to Bangalore if geolocation fails
  const [loc, setLoc] = useState({ lat: 12.9716, lng: 77.5946 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => fetchWeather(loc.lat, loc.lng)
      );
    } else {
      fetchWeather(loc.lat, loc.lng);
    }
  }, []);

  const fetchWeather = async (lat, lng) => {
    try {
      const res = await api.get(`/weather/forecast?lat=${lat}&lng=${lng}`);
      setForecastData(res.data);
    } catch (err) {
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container"><p>Loading weather forecast...</p></div>;
  if (error) return <div className="page-container"><p>{error}</p></div>;

  const todayForecast = forecastData.forecast[0];
  const upcomingForecast = forecastData.forecast.slice(1, 5); // next 4 days

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Weather-Aware Scheduling</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Check weather conditions before scheduling outdoor jobs like painting or construction.
      </p>

      {/* Today's Highlight */}
      <div className="dashboard-card" style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px', background: 'linear-gradient(to right, var(--bg-card), rgba(59,130,246,0.05))' }}>
        <div style={{ fontSize: '4rem' }}>{todayForecast.icon}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Today's Outlook</h3>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{todayForecast.description}</div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', color: 'var(--text-secondary)' }}>
            <span>🌡️ High: {todayForecast.temp_max}°C</span>
            <span>💧 Rain: {todayForecast.precipitation}mm</span>
            <span>💨 Wind: {todayForecast.wind_speed_max}km/h</span>
          </div>
        </div>
        <div>
          {todayForecast.safe_for_outdoor ? (
            <div style={{ padding: '12px 24px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)', borderRadius: '8px', fontWeight: 'bold' }}>
              ✔ Safe for Outdoor Work
            </div>
          ) : (
            <div style={{ padding: '12px 24px', background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', borderRadius: '8px', fontWeight: 'bold' }}>
              ⚠ Proceed with Caution
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {todayForecast.alerts.length > 0 && (
        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {todayForecast.alerts.map((alert, i) => (
            <div key={i} className={`weather-alert weather-alert-${alert.type}`}>
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* 4-Day Forecast Grid */}
      <h3>Upcoming Forecast</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {upcomingForecast.map((day, i) => (
          <WeatherCard key={i} forecast={day} />
        ))}
      </div>
    </div>
  );
};

export default WeatherScheduling;
