import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Import images using require for Docusaurus
const temperatureIcon = require('@site/static/img/temperature.png').default;
const precipitationIcon = require('@site/static/img/precipitation.png').default;

// WCAG compliant colors
const colors = {
  primary: '#205493',    // Accessible blue
  secondary: '#2e8540',  // Accessible green
  text: '#212121',       // Dark gray for text
  background: '#ffffff', // White background
  accent: '#981b1e'      // Accessible red
};

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="Weather Dashboard"
      description="Real-time weather forecasting application with temperature and precipitation data"
    >
      <header 
        className="hero" 
        style={{
          backgroundColor: colors.primary,
          color: colors.background
        }}
      >
        <div className="container">
          <h1 className="hero__title">Weather Dashboard</h1>
          <p className="hero__subtitle">
            Real-time weather forecasts with customizable units and durations
          </p>
        </div>
      </header>

      <main>
        <section className="features padding-vert--xl">
          <div className="container">
            <div className="row">
              <div className="col col--6">
                <div className="card">
                  <div className="card__image">
                    <img
                      src={temperatureIcon}
                      alt="Temperature icon"
                      style={{ 
                        maxHeight: '200px',
                        display: 'block',
                        margin: '0 auto',
                        padding: '1rem'
                      }}
                    />
                  </div>
                  <div className="card__header">
                    <h2 style={{color: '#CC0000'}}>Temperature Forecast</h2>
                  </div>
                  <div className="card__body">
                    <p style={{color: '#CC0000'}}>View temperature forecasts with multiple unit options:</p>
                    <ul>
                      <li>Kelvin</li>
                      <li>Celsius</li>
                      <li>Fahrenheit</li>
                      <br></br>
                    </ul>
                    <Link
                      className="button button--lg"
                      to="/weather"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.background
                      }}
                    >
                      View Temperature Data
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col col--6">
                <div className="card">
                  <div className="card__image">
                    <img
                      src={precipitationIcon}
                      alt="Precipitation icon"
                      style={{ 
                        maxHeight: '200px',
                        display: 'block',
                        margin: '0 auto',
                        padding: '1rem'
                      }}
                    />
                  </div>
                  <div className="card__header">
                    <h2 style={{color: '#0052CC'}}>Precipitation Forecast</h2>
                  </div>
                  <div className="card__body">
                    <p style={{color: '#0052CC'}}>Track precipitation with various time ranges:</p>
                    <ul>
                      <li>24-hour forecast</li>
                      <li>2-day forecast</li>
                      <li>3-day forecast</li>
                      <li>Weekly forecast</li>
                    </ul>
                    <Link
                      className="button button--lg"
                      to="/precipitation"
                      style={{
                        backgroundColor: colors.secondary,
                        color: colors.background
                      }}
                    >
                      View Precipitation Data
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section 
          className="features padding-vert--xl"
          style={{backgroundColor: '#f5f6f7'}}
        >
          <div className="container">
            <div className="text--center">
              <h2 style={{color: colors.text}}>Features</h2>
              <div className="row">
                <div className="col">
                  <h3 style={{color: colors.primary}}>Automatic Location Detection</h3>
                  <p style={{color: colors.text}}>Uses IP-based geolocation for instant local weather</p>
                </div>
                <div className="col">
                  <h3 style={{color: colors.primary}}>Multiple Time Ranges</h3>
                  <p style={{color: colors.text}}>View forecasts from 24 hours to one week</p>
                </div>
                <div className="col">
                  <h3 style={{color: colors.primary}}>City Search</h3>
                  <p style={{color: colors.text}}>Look up weather data for any city worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
