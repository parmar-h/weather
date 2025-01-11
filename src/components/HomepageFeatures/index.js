// src/pages/index.js
import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout
      title="Weather Dashboard"
      description="Weather visualization dashboard">
      <main>
        <div className="container margin-vert--lg text--center">
          <h1>Weather Dashboard</h1>
          <p>View real-time weather data visualizations</p>
          <Link
            className="button button--primary button--lg"
            to="/weather">
            View Weather Charts
          </Link>
        </div>
      </main>
    </Layout>
  );
}
