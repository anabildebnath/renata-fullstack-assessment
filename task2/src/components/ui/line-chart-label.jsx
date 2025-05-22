"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function LineChartLabel({ data = [] }) {
  // Process data for the chart
  const divisionCounts = data.reduce((acc, item) => {
    const division = item.Division || "Unknown";
    acc[division] = (acc[division] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(divisionCounts),
    datasets: [
      {
        label: "Customers by Division",
        data: Object.values(divisionCounts),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Division Distribution",
      },
    },
  };

  return (
    <div className="w-full h-[300px] p-4 bg-white rounded-lg shadow">
      <Line options={options} data={chartData} />
    </div>
  );
}
