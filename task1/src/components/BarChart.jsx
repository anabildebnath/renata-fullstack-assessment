import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import LegendBrush from "./LegendBrush.jsx"; // ✅ Import

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ data }) {
  const labels = data.map((d) => d.product);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Value",
        data: data.map((d) => d.totalValue),
        backgroundColor: "rgba(59, 130, 246, 0.7)", // blue
      },
      {
        label: "Total Sales",
        data: data.map((d) => d.totalSales),
        backgroundColor: "rgba(16, 185, 129, 0.7)", // green
      },
      {
        label: "Difference",
        data: data.map((d) => d.totalValue - d.totalSales),
        backgroundColor: "rgba(234, 179, 8, 0.7)", // amber
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "TotalSales",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Product",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    animation: {
      duration: 800,
      easing: "easeOutCubic",
    },
  };

  return (
    <div className="flex items-start space-x-8">
      <div className="flex-1">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
