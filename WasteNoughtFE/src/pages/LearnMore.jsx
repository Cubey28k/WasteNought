// src/pages/LearnMore.jsx

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

function LearnMore() {
  return (
    <Box className="learn-more" sx={{ padding: 2 }}>


      <Box sx={{ marginBottom: 3 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h2">
              Save Money and Eliminate Waste with WasteNought
            </Typography>
            <Typography variant="body1" paragraph>
              In the food and beverage industry, maintaining optimal refrigeration is crucial. A faulty walk-in fridge or refrigeration unit can lead to significant financial losses and waste. WasteNought is designed to help businesses avoid these costly issues by providing real-time temperature monitoring and alerts for your refrigeration systems.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="h3">
                Key Benefits
              </Typography>
              <ul>
                <li>
                  <strong>Prevent Spoilage:</strong> Receive immediate alerts if the temperature in your fridge goes out of the safe range, allowing you to take quick action and prevent spoilage.
                </li>
                <li>
                  <strong>Reduce Waste:</strong> By maintaining consistent refrigeration, you can minimize the amount of food and beverage waste due to improper storage conditions.
                </li>
                <li>
                  <strong>Save Money:</strong> Avoid the financial impact of spoiled goods and reduce energy costs by ensuring your refrigeration units are running efficiently.
                </li>
                <li>
                  <strong>Peace of Mind:</strong> With WasteNought, you can focus on running your business, knowing that your refrigeration systems are being monitored around the clock.
                </li>
              </ul>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="h3">
                How It Works
              </Typography>
              <ol>
                <li>
                  <strong>Temperature Monitoring:</strong> WasteNought uses a Raspberry Pi Zero 2 W and a DHT11 sensor to continuously monitor the temperature inside your walk-in fridge or other refrigeration units.
                </li>
                <li>
                  <strong>Real-Time Alerts:</strong> If the temperature deviates from the set range, WasteNought immediately sends an alert to notify you of the issue.
                </li>
                <li>
                  <strong>Data Logging:</strong> All temperature data is logged and sent to a central server, which can be accessed via an easy-to-use dashboard.
                </li>
                <li>
                  <strong>Dashboard Access:</strong> The dashboard allows you to view historical temperature data, set alert thresholds, and manage multiple refrigeration units from one central location.
                </li>
              </ol>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ marginTop: 3 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="body1">
              WasteNought is your reliable partner in maintaining optimal refrigeration conditions, ensuring your products stay fresh and your business runs smoothly.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default LearnMore;