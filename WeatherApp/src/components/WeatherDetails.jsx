import React from 'react';

const WeatherDetails = ({ main, wind, sys, dt, convertTemp }) => (
  <div className="weather-details">
    <div className="detail-item">
      <div className="detail-icon">💧</div>
      <div className="detail-info">
        <span>Humidity</span>
        <span>{main.humidity}%</span>
      </div>
    </div>
    <div className="detail-item">
      <div className="detail-icon">💨</div>
      <div className="detail-info">
        <span>Wind</span>
        <span>{wind.speed} m/s</span>
      </div>
    </div>
    <div className="detail-item">
      <div className="detail-icon">🌡️</div>
      <div className="detail-info">
        <span>Feels Like</span>
        <span>{convertTemp(main.feels_like)}°</span>
      </div>
    </div>
    <div className="detail-item">
      <div className="detail-icon">📏</div>
      <div className="detail-info">
        <span>Pressure</span>
        <span>{main.pressure} hPa</span>
      </div>
    </div>
    <div className="detail-item">
      <div className="detail-icon">🔽</div>
      <div className="detail-info">
        <span>Min Temp</span>
        <span>{convertTemp(main.temp_min)}°</span>
      </div>
    </div>
    <div className="detail-item">
      <div className="detail-icon">🔼</div>
      <div className="detail-info">
        <span>Max Temp</span>
        <span>{convertTemp(main.temp_max)}°</span>
      </div>
    </div>
    <div className="detail-item">
      <div className="detail-icon">🌅</div>
      <div className="detail-info">
        <span>Sunrise</span>
        <span>{new Date(sys.sunrise * 1000).toLocaleTimeString()}</span>
      </div>
    </div>
    <div className="detail-item">
      <div className="detail-icon">🌇</div>
      <div className="detail-info">
        <span>Sunset</span>
        <span>{new Date(sys.sunset * 1000).toLocaleTimeString()}</span>
      </div>
    </div>
    <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
      <div className="detail-icon">🕒</div>
      <div className="detail-info">
        <span>Last Updated</span>
        <span>{new Date(dt * 1000).toLocaleTimeString()}</span>
      </div>
    </div>
  </div>
);

export default WeatherDetails;