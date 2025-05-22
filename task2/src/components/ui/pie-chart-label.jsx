"use client";

import * as React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChartLabel({ data = [] }) {
  // Validate the data prop
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("Invalid or empty data provided to PieChartLabel:", data);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Highest Salary by Division</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No valid data to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
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
    <Card>
      <CardHeader>
        <CardTitle>Highest Salary by Division</CardTitle>
        <CardDescription>
          Showing the highest salary and division details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] p-4 bg-white rounded-lg shadow">
          <Pie data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
