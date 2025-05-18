//File: src/components/chart-area-interactive.jsx
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function ChartAreaInteractive({ data }) {
  // Group data by division and calculate metrics
  const grouped = data.reduce((acc, curr) => {
    const division = curr.Division
    if (!acc[division]) {
      acc[division] = { count: 0, ages: [], salaries: [] }
    }
    acc[division].count += 1
    acc[division].ages.push(curr.Age)
    acc[division].salaries.push(curr.Income)
    return acc
  }, {})

  // Helper function to calculate median
  const calculateMedian = (arr) => {
    if (!arr.length) return 0
    const sorted = [...arr].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2
  }

  // Prepare chart data
  const rawChartData = Object.entries(grouped).map(([division, values]) => ({
    division,
    count: values.count,
    medianAge: calculateMedian(values.ages),
    medianSalary: calculateMedian(values.salaries),
  }))

  // Find the highest median salary and age for normalization
  const maxMedianSalary = Math.max(...rawChartData.map((d) => d.medianSalary))
  const maxMedianAge = Math.max(...rawChartData.map((d) => d.medianAge))

  // Normalize median salary and age relative to the highest values
  const chartData = rawChartData.map((d) => ({
    ...d,
    normalizedMedianSalary: (d.medianSalary / maxMedianSalary) * Math.max(...rawChartData.map((d) => d.count)),
    normalizedMedianAge: (d.medianAge / maxMedianAge) * Math.max(...rawChartData.map((d) => d.count)),
  }))

  const chartConfig = {
    count: {
      label: "Users",
      color: "hsl(var(--chart-1))", // Green
    },
    normalizedMedianAge: {
      label: "Median Age",
      color: "hsl(var(--chart-2))", // Blue
    },
    normalizedMedianSalary: {
      label: "Median Salary",
      color: "hsl(var(--chart-3))", // Red
    },
  }

  return (
    <Card className="@container/card mx-6 rounded-[var(--radius)] border border-[oklch(0%_0%_98%)]">
      <CardHeader className="relative">
        <CardTitle>Division Metrics</CardTitle>
        <CardDescription>
          Overlapping charts for Users, Median Age, and Median Salary grouped by division
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 16,
              bottom: 16,
            }}
          >
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMedianAge" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMedianSalary" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="division"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                  formatter={(value, name, props) => {
                    if (name === "normalizedMedianAge") {
                      return [`Median Age: ${props.payload.medianAge}`];
                    }
                    if (name === "normalizedMedianSalary") {
                      return [`Median Salary: ${props.payload.medianSalary}`];
                    }
                    return [value, name];
                  }}
                />
              }
            />
            <Area
              dataKey="count"
              type="natural"
              fill="url(#fillCount)"
              stroke="hsl(var(--chart-1))"
              stackId="a"
            />
            <Area
              dataKey="normalizedMedianAge"
              type="natural"
              fill="url(#fillMedianAge)"
              stroke="hsl(var(--chart-2))"
              stackId="a"
            />
            <Area
              dataKey="normalizedMedianSalary"
              type="natural"
              fill="url(#fillMedianSalary)"
              stroke="hsl(var(--chart-3))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

