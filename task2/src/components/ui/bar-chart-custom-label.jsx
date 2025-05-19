"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

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

export function BarChartCustomLabel({ data = [] }) {
  // Validate the data prop
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("Invalid or empty data provided to BarChartCustomLabel:", data);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customers in Each Division</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No valid data to display.</p>
        </CardContent>
      </Card>
    );
  }

  // Group data by division and count customers
  const divisionData = data.reduce((acc, record) => {
    const division = record.Division || "Unknown";
    acc[division] = (acc[division] || 0) + 1;
    return acc;
  }, {});

  // Prepare chart data
  const chartData = Object.entries(divisionData).map(([division, count]) => ({
    division,
    count,
  }));

  const chartConfig = {
    division: {
      label: "Division",
      color: "hsl(var(--chart-1))",
    },
    count: {
      label: "Customers",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers in Each Division</CardTitle>
        <CardDescription>Division-wise customer count</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="division"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => [
                    `${value} Customers`,
                    props.payload.division,
                  ]}
                />
              }
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-division)"
              radius={4}
            >
              <LabelList
                dataKey="division"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing division-wise customer count
        </div>
      </CardFooter>
    </Card>
  );
}
