//File: src/components/chart-area-interactive.jsx
"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function ChartAreaInteractive({ data }) {
  // show count by division
  const grouped = data.reduce((a, c) => {
    a[c.Division] = (a[c.Division] || 0) + 1
    return a
  }, {})
  const scalingFactor = 2
  const chartData = Object.entries(grouped).map(([division, count]) => ({
    division,
    count: count / scalingFactor,
  }))

  const chartConfig = {
    count: {
      label: "Users",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card className="@container/card mx-6 rounded-[var(--radius)] border border-[oklch(0%_0%_98%)]">
      <CardHeader className="relative">
        <CardTitle>Total Users by Division</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total users grouped by division
          </span>
          <span className="@[540px]/card:hidden">Users by division</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
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
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="division"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
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
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

