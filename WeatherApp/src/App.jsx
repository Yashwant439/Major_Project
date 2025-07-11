import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherHeader from './components/WeatherHeader';
import WeatherMain from './components/WeatherMain';
import WeatherDetails from './components/WeatherDetails';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';

const weatherIcons = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '⛅',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌦️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️'
};

const weatherBackgrounds = {
  'clear': 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'clouds': 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
  'rain': 'linear-gradient(135deg, #005C97 0%, #363795 100%)',
  'thunderstorm': 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
  'snow': 'linear-gradient(135deg, #E6DADA 0%, #274046 100%)',
  'mist': 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
  'default': 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)'
};

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Delhi');
  const [tempUnit, setTempUnit] = useState('celsius');
  const [bgAnimation, setBgAnimation] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  
  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    setBgAnimation(true);
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
      } else {
        setError(data.message || 'Failed to fetch weather data');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
      setTimeout(() => setBgAnimation(false), 1000);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  const toggleTempUnit = () => {
    setTempUnit(tempUnit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const convertTemp = (temp) => {
    if (tempUnit === 'fahrenheit') {
      return Math.round((temp * 9) / 5 + 32);
    }
    return Math.round(temp);
  };

  const getWeatherBackground = () => {
    if (!weatherData) return weatherBackgrounds.default;
    const condition = weatherData.weather[0].main.toLowerCase();
    return weatherBackgrounds[condition] || weatherBackgrounds.default;
  };

  return (
    <div
      className={`app ${bgAnimation ? 'bg-change' : ''}`}
      style={{ background: getWeatherBackground() }}
    >
      <div className="container">
        <h1 className="app-title">Weather Forecast</h1>
        <SearchBar city={city} setCity={setCity} onSearch={handleSearch} />
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage error={error} onRetry={fetchWeatherData} />}
        {weatherData && !loading && !error && (
          <>
            <WeatherHeader name={weatherData.name} country={weatherData.sys.country} />
            <WeatherMain
              temp={weatherData.main.temp}
              tempUnit={tempUnit}
              toggleTempUnit={toggleTempUnit}
              convertTemp={convertTemp}
              icon={weatherIcons[weatherData.weather[0].icon] || '🌡️'}
              description={weatherData.weather[0].description}
            />
            <WeatherDetails
              main={weatherData.main}
              wind={weatherData.wind}
              sys={weatherData.sys}
              dt={weatherData.dt}
              convertTemp={convertTemp}
            />
          </>
        )}
        <div className="footer">
          <p>made by- Yashwant✌️</p>
        </div>
      </div>
    </div>
  );
};

export default App;