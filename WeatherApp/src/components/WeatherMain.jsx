import React from 'react';

const WeatherMain = ({
  temp,
  tempUnit,
  toggleTempUnit,
  convertTemp,
  icon,
  description
}) => (
  <div className="weather-main">
    <div className="temperature-display">
      <div className="temp-value">
        {convertTemp(temp)}
        <sup>°{tempUnit === 'celsius' ? 'C' : 'F'}</sup>
      </div>
      <button onClick={toggleTempUnit} className="unit-toggle">
        Switch to °{tempUnit === 'celsius' ? 'F' : 'C'}
      </button>
    </div>
    <div className="weather-icon">
      <div className="icon-display">{icon}</div>
      <p className="weather-description">{description}</p>
    </div>
  </div>
);

export default WeatherMain;