// WalkInMonitor.jsx
import React from 'react';
import Chart from './Chart';

const WalkInMonitor = ({ walkInName, chartData, chartOptions, onDelete }) => {
  return (
    <div className="walk-in-monitor">
      <h2>{walkInName}</h2>
      <Chart data={chartData} options={chartOptions} />
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default WalkInMonitor;
