"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function LineChartLabel({ data = [] }) {
  // Validate the data prop
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("Invalid or empty data provided to LineChartLabel:", data);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Median Salary by Division</CardTitle>
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

  // Filter out records with invalid or undefined Division values
  const validData = data.filter(
    (record) => record.Division && record.Division.trim() !== ""
  );

  if (validData.length === 0) {
    console.warn("No valid Division data available for LineChartLabel.");
    return (
      <Card>
        <CardHeader>
          <CardTitle>Median Salary by Division</CardTitle>
          <CardDescription>No valid division data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No valid division data to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group data by division and calculate median salary
  const groupedData = validData.reduce((acc, record) => {
    const division = record.Division.trim();
    if (!acc[division]) {
      acc[division] = [];
    }
    acc[division].push(record.Income || 0);
    return acc;
  }, {});

  // Helper function to calculate median
  const calculateMedian = (arr) => {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  // Prepare chart data
  const chartData = Object.entries(groupedData).map(([division, incomes]) => ({
    division,
    medianSalary: calculateMedian(incomes),
  }));

  const chartConfig = {
    medianSalary: {
      label: "Median Salary",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Median Salary by Division</CardTitle>
        <CardDescription>
          Showcasing the median salary of each division
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="division"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="medianSalary"
              type="natural"
              stroke="var(--color-medianSalary)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-medianSalary)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Based on division-wise median salary data
        </div>
      </CardFooter>
    </Card>
  );
}
