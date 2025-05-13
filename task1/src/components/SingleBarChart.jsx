import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// Map totalValue → bar color
function getColor(value) {
  if (value >= 35) return 'rgba(220, 38, 38, 0.8)';   // red
  if (value >= 30) return 'rgba(249, 115, 22, 0.8)'; // orange
  if (value >= 25) return 'rgba(234, 179, 8, 0.8)';  // yellow
  return 'rgba(107, 114, 128, 0.5)';               // gray fallback
}

export default function SingleBarChart({ data }) {
  const labels   = data.map(d => d.product);
  const values   = data.map(d => d.totalSales);
  const bgColors = data.map(d => getColor(d.totalValue));

  const chartData = {
    labels,
    datasets: [{
      label: 'Total Sales',
      data: values,
      backgroundColor: bgColors,
    }],
  };

  const options = {
    responsive: true,
    plugins: { tooltip: { enabled: true } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 2 },
        max: 18,
      },
    },
  };

  return (
    <div className="flex items-start space-x-8">
      <div className="flex-1">
        <Bar data={chartData} options={options} />
      </div>
      <div className="w-32">
        <h2 className="font-bold mb-2 text-center">Value Ranges</h2>
        <div className="flex flex-col space-y-1">
          <div className="h-6 bg-red-600" />
          <span className="text-sm text-center">35 – 40</span>
          <div className="h-6 bg-orange-500" />
          <span className="text-sm text-center">30 – 35</span>
          <div className="h-6 bg-yellow-400" />
          <span className="text-sm text-center">25 – 30</span>
        </div>
      </div>
    </div>
  );
}
