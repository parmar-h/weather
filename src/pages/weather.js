import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import WeatherChart from '../components/WeatherChart';

const colors = {
  primary: '#205493',
  secondary: '#2e8540',
  text: '#212121',
  background: '#ffffff'
};

const celsiusToFahrenheit = (celsius) => (celsius * 9/5) + 32;
const celsiusToKelvin = (celsius) => celsius + 273.15;

const unitColors = {
  kelvin: {
    borderColor: 'khaki',
    backgroundColor: 'rgba(240, 230, 140, 0.2)'
  },
  celsius: {
    borderColor: 'cyan',
    backgroundColor: 'rgba(0, 255, 255, 0.2)'
  },
  fahrenheit: {
    borderColor: 'fuchsia',
    backgroundColor: 'rgba(255, 0, 255, 0.2)'
  }
};

const forecastDurations = {
  '24h': { hours: 24, label: 'Next 24 Hours' },
  '48h': { hours: 48, label: 'Next 2 Days' },
  '72h': { hours: 72, label: 'Next 3 Days' },
  '168h': { hours: 168, label: 'Next Week' }
};

export default function WeatherPage() {
  const [cityName, setCityName] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tempUnit, setTempUnit] = useState('kelvin');
  const [rawData, setRawData] = useState(null);
  const [duration, setDuration] = useState('24h');

  useEffect(() => {
    const getLocationByIP = async () => {
      try {
        const response = await fetch(
          'https://api.ipgeolocation.io/ipgeo?apiKey=028272891e6549fb862bbaef98c3df8f'
        );
        const data = await response.json();
        
        if (response.ok) {
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&hourly=temperature_2m`
          );
          const weatherData = await weatherResponse.json();

          const formattedData = {
            labels: weatherData.hourly.time.map(time => 
              new Date(time).toLocaleTimeString('en-US', { 
                hour: '2-digit',
                month: 'short',
                day: 'numeric'
              })
            ),
            datasets: [{
              label: `Temperature in ${data.city} (K)`,
              data: weatherData.hourly.temperature_2m,
              borderColor: unitColors.kelvin.borderColor,
              backgroundColor: unitColors.kelvin.backgroundColor,
              tension: 0.1,
              fill: true
            }]
          };

          setRawData(formattedData);
          setChartData(convertTemperature(formattedData, tempUnit, duration));
          setCityName(data.city);
        }
      } catch (err) {
        setError('Failed to detect location automatically');
      }
    };

    getLocationByIP();
  }, []);

  const convertTemperature = (celsiusData, unit, selectedDuration) => {
    if (!celsiusData) return null;

    const hours = forecastDurations[selectedDuration].hours;
    const convertedData = {
      labels: celsiusData.labels.slice(0, hours),
      datasets: [{
        ...celsiusData.datasets[0],
        data: celsiusData.datasets[0].data.slice(0, hours)
      }]
    };

    switch(unit) {
      case 'fahrenheit':
        convertedData.datasets[0].data = convertedData.datasets[0].data.map(temp => celsiusToFahrenheit(temp));
        convertedData.datasets[0].label = convertedData.datasets[0].label.replace(/°[CKF]|K/, '°F');
        convertedData.datasets[0].borderColor = unitColors.fahrenheit.borderColor;
        convertedData.datasets[0].backgroundColor = unitColors.fahrenheit.backgroundColor;
        break;
      case 'kelvin':
        convertedData.datasets[0].data = convertedData.datasets[0].data.map(temp => celsiusToKelvin(temp));
        convertedData.datasets[0].label = convertedData.datasets[0].label.replace(/°[CKF]|K/, 'K');
        convertedData.datasets[0].borderColor = unitColors.kelvin.borderColor;
        convertedData.datasets[0].backgroundColor = unitColors.kelvin.backgroundColor;
        break;
      case 'celsius':
        convertedData.datasets[0].label = convertedData.datasets[0].label.replace(/°[CKF]|K/, '°C');
        convertedData.datasets[0].borderColor = unitColors.celsius.borderColor;
        convertedData.datasets[0].backgroundColor = unitColors.celsius.backgroundColor;
        break;
    }

    return convertedData;
  };

  const handleUnitChange = (unit) => {
    setTempUnit(unit);
    if (rawData) {
      setChartData(convertTemperature(rawData, unit, duration));
    }
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    if (rawData) {
      setChartData(convertTemperature(rawData, tempUnit, newDuration));
    }
  };

  const handleCitySearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results?.length) {
        throw new Error('City not found');
      }

      const { latitude, longitude } = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
      );
      const weatherData = await weatherResponse.json();

      const formattedData = {
        labels: weatherData.hourly.time.map(time => 
          new Date(time).toLocaleTimeString('en-US', { 
            hour: '2-digit',
            month: 'short',
            day: 'numeric'
          })
        ),
        datasets: [{
          label: `Temperature in ${cityName} (K)`,
          data: weatherData.hourly.temperature_2m,
          borderColor: unitColors.kelvin.borderColor,
          backgroundColor: unitColors.kelvin.backgroundColor,
          tension: 0.1,
          fill: true
        }]
      };

      setRawData(formattedData);
      setChartData(convertTemperature(formattedData, tempUnit, duration));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Weather Forecast">
      <header 
        style={{
          backgroundColor: colors.primary,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: `1px solid ${colors.background}`
        }}
      >
        <div 
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem'
          }}
        >
          <h1 style={{ margin: 0, color: colors.background }}>Weather Dashboard</h1>
          <nav>
            <div 
              style={{
                display: 'flex',
                gap: '2rem',
                alignItems: 'center'
              }}
            >
              <Link
                to="/"
                style={{
                  color: colors.background,
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Home
              </Link>
              <Link
                to="/weather"
                style={{
                  color: colors.background,
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Weather
              </Link>
              <Link
                to="/precipitation"
                style={{
                  color: colors.background,
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Precipitation
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container margin-vert--lg">
        <form onSubmit={handleCitySearch} className="search-form">
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="Enter city name"
            className="search-input"
          />
          <button 
            type="submit" 
            disabled={loading}
            className={`button ${loading ? '' : `button--active button--${tempUnit}`}`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="toggle-container">
          <div className="unit-toggle">
            <button 
              className={`button ${tempUnit === 'kelvin' ? 'button--active button--kelvin' : ''}`}
              onClick={() => handleUnitChange('kelvin')}
            >
              Kelvin
            </button>
            <button 
              className={`button ${tempUnit === 'celsius' ? 'button--active button--celsius' : ''}`}
              onClick={() => handleUnitChange('celsius')}
            >
              Celsius
            </button>
            <button 
              className={`button ${tempUnit === 'fahrenheit' ? 'button--active button--fahrenheit' : ''}`}
              onClick={() => handleUnitChange('fahrenheit')}
            >
              Fahrenheit
            </button>
          </div>

          <div className="duration-toggle">
            {Object.entries(forecastDurations).map(([key, value]) => (
              <button
                key={key}
                className={`button ${duration === key ? `button--active button--${tempUnit}` : ''}`}
                onClick={() => handleDurationChange(key)}
                aria-label={`Show forecast for ${value.label}`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        {chartData && <WeatherChart data={chartData} />}
      </main>
    </Layout>
  );
}
