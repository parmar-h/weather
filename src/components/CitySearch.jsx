import React, { useState } from 'react';

export default function CitySearch({ onCitySelect }) {
  const [cityInput, setCityInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1&language=en&format=json`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        onCitySelect({
          name: result.name,
          latitude: result.latitude,
          longitude: result.longitude
        });
      } else {
        setError('City not found');
      }
    } catch (err) {
      setError('Failed to search city');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="city-search">
      <form onSubmit={handleCitySearch} className="search-form">
  <input
    type="text"
    value={cityName}
    onChange={(e) => setCityName(e.target.value)}
    placeholder="Enter city name"
    className="search-input"
    aria-label="City name"  // Add this line
  />
  <button 
    type="submit" 
    disabled={loading}
    className={`button ${loading ? '' : `button--active button--${tempUnit}`}`}
    aria-label="Search city"  // Add this line
  >
    {loading ? 'Searching...' : 'Search'}
  </button>
</form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
