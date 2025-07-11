import React from 'react';

const WeatherHeader = ({ name, country }) => (
  <div className="weather-header">
    <h2 className="city-name">
      {name}, {country}
    </h2>
    <p className="weather-date">
      {new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </p>
  </div>
);

export default WeatherHeader;