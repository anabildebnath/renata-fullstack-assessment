import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
} from 'chart.js';
import LegendBrush from './LegendBrush';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

// Fixed color palette (8 levels)
const fixedColors = [
  'rgba(69, 10, 10, 0.9)',     // red-950
  'rgba(154, 52, 18, 0.9)',    // orange-700
  'rgba(234, 88, 12, 0.9)',    // orange-600
  'rgba(251, 146, 60, 0.9)',   // orange-400
  'rgba(253, 186, 116, 0.9)',  // orange-300
  'rgba(254, 215, 170, 0.9)',  // orange-200
  'rgba(255, 237, 213, 0.9)',  // orange-100
  'rgba(255, 247, 237, 0.9)',  // orange-50
];

// Generate dynamic ranges but fixed colors
function generateColorRanges(max) {
  const step = Math.ceil(max / 8);
  const ranges = [];
  for (let i = 0; i < 8; i++) {
    const start = max - i * step;
    const end = Math.max(0, start - step + 1);
    ranges.push({
      color: fixedColors[i],
      label: `${start}–${end}`,
      min: end,
      max: start,
    });
  }
  return ranges;
}

// Assign color based on range
function getColor(value, ranges) {
  for (const r of ranges) {
    if (value >= r.min && value <= r.max) return r.color;
  }
  return 'rgba(255,255,255,1)';
}

export default function SingleBarChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.totalValue));
  const maxSales = Math.max(...data.map(d => d.totalSales));
  const colorRanges = generateColorRanges(maxVal);

  const labels = data.map(d => d.product);
  const values = data.map(d => d.totalSales);
  const bgColors = data.map(d => getColor(d.totalValue, colorRanges));

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
    animation: {
      duration: 800,
      easing: 'easeOutBounce',
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (items) => `Product: ${items[0].label}`,
          label: (item) => `TotalSales: ${item.formattedValue}`,
          afterLabel: (item) => `TotalValue: ${data[item.dataIndex].totalValue}`
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.ceil(maxSales / 5) * 5 + 5,
        title: {
          display: true,
          text: 'TotalSales',
          font: { weight: 'bold', size: 14 },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Product',
          font: { weight: 'bold', size: 14 },
        },
      },
    },
  };

  return (
    <div className="flex items-start space-x-8">
      <div className="flex-1">
        <Bar data={chartData} options={options} />
      </div>
      <div className="w-40">
        <h2 className="font-bold mb-2 text-center">Value Ranges</h2>
        <LegendBrush ranges={colorRanges} />
      </div>
    </div>
  );
}
