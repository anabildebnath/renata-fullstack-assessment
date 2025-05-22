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
  // Filter out records with invalid or undefined Division values
  const validData = data.filter((record) => record.Division && record.Division.trim() !== "");

  // Group data by division and calculate metrics
  const grouped = validData.reduce((acc, curr) => {
    const division = curr.Division.trim(); // Ensure no leading/trailing whitespace
    if (!acc[division]) {
      acc[division] = { count: 0, ages: [], salaries: [] };
    }
    acc[division].count += 1;
    acc[division].ages.push(curr.Age);
    acc[division].salaries.push(curr.Income);
    return acc;
  }, {});

  // Helper function to calculate median
  const calculateMedian = (arr) => {
    if (!arr.length) return 0;
    // Convert all values to numbers and sort
    const sorted = [...arr].map(Number).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    // For even length, take average of two middle values
    if (sorted.length % 2 === 0) {
      return Math.floor((sorted[mid - 1] + sorted[mid]) / 2);
    }
    // For odd length, take middle value
    return sorted[mid];
  };

  // Prepare chart data
  const chartData = Object.entries(grouped).map(([division, values]) => {
    const count = values.count;
    const medianAge = calculateMedian(values.ages);
    const medianSalary = calculateMedian(values.salaries);

    console.log(`${division} stats:`, {
      count,
      ages: values.ages,
      salaries: values.salaries,
      medianAge,
      medianSalary
    }); // Debug log

    return {
      division,
      count,
      medianAge,
      medianSalary,
      normalizedMedianAge: (medianAge / Math.max(...Object.values(grouped).map(g => calculateMedian(g.ages)))) * count,
      normalizedMedianSalary: (medianSalary / Math.max(...Object.values(grouped).map(g => calculateMedian(g.salaries)))) * count,
    };
  });

  // Find the highest values for normalization (keep this part)
  const maxMedianSalary = Math.max(...chartData.map((d) => d.medianSalary));
  const maxMedianAge = Math.max(...chartData.map((d) => d.medianAge));
  const maxCount = Math.max(...chartData.map((d) => d.count));

  const chartConfig = {
    count: {
      label: "Users",
      color: "hsl(var(--chart-3))", 
    },
    normalizedMedianAge: {
      label: "Median Age",
      color: "hsl(var(--chart-4))", 
    },
    normalizedMedianSalary: {
      label: "Median Salary",
      color: "hsl(var(--chart-5))", 
    },
  };

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
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.3}
                />
              </linearGradient>
              <linearGradient id="fillMedianAge" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-4))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-4))"
                  stopOpacity={0.8}
                />
              </linearGradient>
              <linearGradient id="fillMedianSalary" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-5))"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-5))"
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
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                
                const data = payload[0]?.payload;
                return (
                  <div className="rounded-lg border border-border bg-background p-2 shadow-sm">
                    <div className="text-sm font-semibold text-foreground mb-1">{label}</div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2" style={{ backgroundColor: chartConfig.count.color }} />
                        <span className="text-sm text-muted-foreground">Total Customers: {data.count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2" style={{ backgroundColor: chartConfig.normalizedMedianAge.color }} />
                        <span className="text-sm text-muted-foreground">Median Age: {data.medianAge} years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2" style={{ backgroundColor: chartConfig.normalizedMedianSalary.color }} />
                        <span className="text-sm text-muted-foreground">
                          Median Salary: ৳{data.medianSalary.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              dataKey="count"
              type="natural"
              fill="url(#fillCount)"
              stroke="hsl(var(--chart-3))"
              stackId="a"
            />
            <Area
              dataKey="normalizedMedianAge"
              type="natural"
              fill="url(#fillMedianAge)"
              stroke="hsl(var(--chart-4))"
              stackId="a"
            />
            <Area
              dataKey="normalizedMedianSalary"
              type="natural"
              fill="url(#fillMedianSalary)"
              stroke="hsl(var(--chart-5))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

