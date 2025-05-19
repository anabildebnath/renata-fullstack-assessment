"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function LineChartInteractive({ data }) {
  // Filter and group data by division and marital status
  const groupedData = data.reduce((acc, record) => {
    const division = record.Division || "Unknown";
    const maritalStatus =
      record.MaritalStatus === "Married" ? "Married" : "Unmarried";

    if (!acc[division]) {
      acc[division] = { Married: 0, Unmarried: 0 };
    }

    acc[division][maritalStatus] += 1;
    return acc;
  }, {});

  // Prepare chart data
  const chartData = Object.entries(groupedData).map(([division, counts]) => ({
    division,
    Married: counts.Married,
    Unmarried: counts.Unmarried,
  }));

  const chartConfig = {
    Married: {
      label: "Married",
      color: "hsl(var(--chart-1))",
    },
    Unmarried: {
      label: "Unmarried",
      color: "hsl(var(--chart-2))",
    },
  };

  const [activeChart, setActiveChart] = React.useState("Married");

  const total = React.useMemo(
    () => ({
      Married: chartData.reduce((acc, curr) => acc + curr.Married, 0),
      Unmarried: chartData.reduce((acc, curr) => acc + curr.Unmarried, 0),
    }),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Line Chart - Interactive</CardTitle>
          <CardDescription>
            Showing marital status distribution across divisions
          </CardDescription>
        </div>
        <div className="flex">
          {["Married", "Unmarried"].map((key) => {
            const chart = key;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[chart].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
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
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => value}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
