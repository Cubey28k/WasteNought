// Chart component for temperature data, using chart.ly and re-usable for multiple walk-ins


import React from 'react';
import { Line } from 'react-chartjs-2';

const Chart = ({ chartData, chartOptions }) => {
  return (
    <div className="chart-container">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default Chart;
