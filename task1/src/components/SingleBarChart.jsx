// src/components/SingleBarChart.jsx

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

// Map totalValue → bar color (5-unit buckets)
function getColor(value) {
  if (value >= 36) return 'rgba(69, 10, 10, 0.9)';     // red-950
  if (value >= 31) return 'rgba(154, 52, 18, 0.9)';    // orange-700
  if (value >= 26) return 'rgba(234, 88, 12, 0.9)';    // orange-600
  if (value >= 21) return 'rgba(251, 146, 60, 0.9)';   // orange-400
  if (value >= 16) return 'rgba(253, 186, 116, 0.9)';  // orange-300
  if (value >= 11) return 'rgba(254, 215, 170, 0.9)';  // orange-200
  if (value >= 6)  return 'rgba(255, 237, 213, 0.9)';  // orange-100
  return 'rgba(255, 247, 237, 0.9)';                   // orange-50
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
    plugins: {
      tooltip: {
        callbacks: {
          // Show the product as the title
          title: (items) => `Product: ${items[0].label}`,
          // First line: TotalSales
          label: (item) => `TotalSales: ${item.formattedValue}`,
          // Second line: TotalValue
          afterLabel: (item) => `TotalValue: ${data[item.dataIndex].totalValue}`
        }
      }
    },
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
        {/* LegendBrush or manual legend here */}
      </div>
    </div>
  );
}
