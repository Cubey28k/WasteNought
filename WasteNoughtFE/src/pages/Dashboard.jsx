import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from '../components/Chart';
import 'chart.js/auto';
import 'chartjs-adapter-luxon'; // Import the Luxon date adapter
import '../styles/Dashboard.css';

function Dashboard() {
  const [walkIns, setWalkIns] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const login = async () => {
      try {
        const response = await axios.post('https://wastenought-be-production.up.railway.app/login', {
          username: 'raspberrypi',  
          password: 'raspberry'  
        });
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        return access_token;
      } catch (error) {
        console.error('Login failed:', error);
        setError('Login failed. Please check your credentials.');
        return null;
      }
    };

    const fetchTemperatureReadings = async (token) => {
      try {
        const response = await axios.get('https://wastenought-be-production.up.railway.app/metric', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API Response:', response.data); // Log entire API response

        const readings = response.data;

        if (!Array.isArray(readings) || readings.length === 0) {
          throw new Error('No data available');
        }

        const labels = readings.map(reading => new Date(reading.timestamp).toISOString());
        const temperatures = readings.map(reading => reading.value);

        setWalkIns([
          {
            id: 1,
            name: 'Founder Ben',
            phone: '(315) 415-5170',
            email: 'founder.ben@example.com',
            chartData: {
              labels: labels,
              datasets: [
                {
                  label: 'Temperature (°F)',
                  data: temperatures,
                  fill: false,
                  backgroundColor: 'rgba(75,192,192,0.2)',
                  borderColor: 'rgba(75,192,192,1)',
                  pointBackgroundColor: 'rgba(75,192,192,1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgba(75,192,192,1)',
                  lineTension: 0,
                },
                {
                  label: 'Target Temperature (°F)',
                  data: Array(labels.length).fill(40),
                  fill: false,
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  borderColor: 'rgba(255,99,132,1)',
                  borderDash: [5, 5],
                  pointStyle: 'dash',
                },
              ],
            },
            chartOptions: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Temperature Over Time',
                },
              },
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'hour',
                    tooltipFormat: 'MMM D, HH:mm', // Format in tooltip
                    displayFormats: {
                      hour: 'MMM D, HH:mm',
                    },
                  },
                  title: {
                    display: true,
                    text: 'Time',
                  },
                },
                y: {
                  beginAtZero: false,
                  suggestedMin: -5,
                  suggestedMax: 45,
                  ticks: {
                    stepSize: 5,
                    callback: function (value) {
                      return value + '°F';
                    },
                  },
                  title: {
                    display: true,
                    text: 'Temperature (°F)',
                  },
                },
              },
              elements: {
                point: {
                  radius: 3,
                },
                line: {
                  tension: 0,
                },
              },
            },
          },
        ]);
        setError(null);
      } catch (error) {
        console.error('Error fetching temperature readings:', error);
        setError('Failed to fetch temperature readings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    const initializeData = async () => {
      const token = await login();
      if (token) {
        await fetchTemperatureReadings(token);
      }
    };

    initializeData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="development-notice">
        <p><strong>Notice:</strong> This dashboard is currently in development. The temperature sensor is currently faulty and displaying inaccurate readings. 
        We are awaiting a new sensor to resolve this issue. Thank you for your patience as we work to improve our monitoring system.
        <strong>When you're set up with a sensor, this will be your login dashboard.</strong></p>
      </div>
      {error && <div className="error-message">{error}</div>}
      {walkIns.map((walkIn) => (
        <div key={walkIn.id}>
          <h2>Contact Information</h2>
          <p>
            <strong>Walk-in Servicer:</strong> {walkIn.name}
          </p>
          <p>
            <strong>Phone:</strong> {walkIn.phone}
          </p>
          <p>
            <strong>Email:</strong> {walkIn.email}
          </p>
          <Chart chartData={walkIn.chartData} chartOptions={walkIn.chartOptions} />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
