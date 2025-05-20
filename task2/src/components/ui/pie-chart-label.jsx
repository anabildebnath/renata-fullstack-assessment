"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

  // Group data by division and find the highest salary and its holder
  const groupedData = data.reduce((acc, record) => {
    const division = record.Division || "Unknown";
    if (!acc[division]) {
      acc[division] = { highestSalary: 0, highestSalaryHolder: "" };
    }
    if (record.Income > acc[division].highestSalary) {
      acc[division].highestSalary = record.Income;
      acc[division].highestSalaryHolder = record.CustomerName || "Unknown";
    }
    return acc;
  }, {});

  // Prepare chart data
  const chartData = Object.entries(groupedData).map(([division, details]) => ({
    division,
    highestSalary: details.highestSalary,
    highestSalaryHolder: details.highestSalaryHolder,
  }));

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#ffc0cb",
  ];

  // Define a valid config for ChartContainer
  const chartConfig = chartData.reduce((acc, entry, index) => {
    acc[entry.division] = {
      label: entry.division,
      color: colors[index % colors.length],
    };
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Highest Salary by Division</CardTitle>
        <CardDescription>
          Showing the highest salary and division details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="highestSalary"
              nameKey="division"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, highestSalary }) =>
                `${highestSalary.toLocaleString()}`
              }
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => [
                    `Highest Salary Holder: ${props.payload.highestSalaryHolder}`,
                    props.payload.division,
                  ]}
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
