import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WeatherChart({ data }) {
  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: '#808080' 
        },
        grid: {
          color: 'rgba(160, 160, 160, 0.2)'
        }
      },
      y: {
        ticks: {
          color: '#808080' 
        },
        grid: {
          color: 'rgba(160, 160, 160, 0.2)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#808080' 
        }
      },
      title: {
        color: '#808080' 
      },
      tooltip: {
        titleColor: '#808080', 
        bodyColor: '#808080'
      }
    }
  };

  if (!data) return null;
  return <Line data={data} options={options} />;
}
