import React from 'react';

const WeatherCard = ({ forecast, isToday = false }) => {
  const dateStr = new Date(forecast.date).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric'
  });

  return (
    <div className="weather-card" style={{ borderColor: isToday ? 'var(--accent-blue)' : 'var(--border-color)' }}>
      <div className="weather-date">{isToday ? 'Today' : dateStr}</div>
      <div className="weather-icon">{forecast.icon}</div>
      <div className="weather-temp">{Math.round(forecast.temp_max)}°C</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{forecast.description}</div>
      
      {forecast.precipitation > 0 && (
        <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', marginTop: '4px' }}>
          💧 {forecast.precipitation}mm
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
