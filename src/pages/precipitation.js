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

const forecastDurations = {
  '24h': { hours: 24, label: 'Next 24 Hours' },
  '48h': { hours: 48, label: 'Next 2 Days' },
  '72h': { hours: 72, label: 'Next 3 Days' },
  '168h': { hours: 168, label: 'Next Week' }
};

export default function PrecipitationPage() {
  const [cityName, setCityName] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState('24h');
  const [rawData, setRawData] = useState(null);

  useEffect(() => {
    const getLocationByIP = async () => {
      try {
        const response = await fetch(
          'https://api.ipgeolocation.io/ipgeo?apiKey=028272891e6549fb862bbaef98c3df8f'
        );
        const data = await response.json();
        
        if (response.ok) {
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&hourly=precipitation`
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
              label: `Precipitation in ${data.city} (mm)`,
              data: weatherData.hourly.precipitation,
              borderColor: '#4169E1',
              backgroundColor: 'rgba(65, 105, 225, 0.2)',
              tension: 0.1,
              fill: true
            }]
          };

          setRawData(formattedData);
          setChartData(formatData(formattedData, duration));
          setCityName(data.city);
        }
      } catch (err) {
        setError('Failed to detect location automatically');
      }
    };

    getLocationByIP();
  }, []);

  const formatData = (data, selectedDuration) => {
    if (!data) return null;

    const hours = forecastDurations[selectedDuration].hours;
    return {
      labels: data.labels.slice(0, hours),
      datasets: [{
        ...data.datasets[0],
        data: data.datasets[0].data.slice(0, hours)
      }]
    };
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    if (rawData) {
      setChartData(formatData(rawData, newDuration));
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
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=precipitation`
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
          label: `Precipitation in ${cityName} (mm)`,
          data: weatherData.hourly.precipitation,
          borderColor: '#4169E1',
          backgroundColor: 'rgba(65, 105, 225, 0.2)',
          tension: 0.1,
          fill: true
        }]
      };

      setRawData(formattedData);
      setChartData(formatData(formattedData, duration));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Precipitation Forecast">
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
            className="button button--active"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="toggle-container">
          <div className="duration-toggle">
            {Object.entries(forecastDurations).map(([key, value]) => (
              <button
                key={key}
                className={`button ${duration === key ? 'button--active' : ''}`}
                onClick={() => handleDurationChange(key)}
                aria-label={`Show forecast for ${value.label}`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        {chartData && <WeatherChart data={chartData} chartType="precipitation" />}
      </main>
    </Layout>
  );
}
