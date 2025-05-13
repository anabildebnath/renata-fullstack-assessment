"use client";
import React from 'react';
import { PieChart as RePieChart, Pie, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card.jsx";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart.jsx";
import { TrendingUp } from 'lucide-react';
const chartConfig = {
  totalValue: { label: 'Total Value' },
  product: { label: 'Product Name' }
};
export default function PieChart({ data }) {
  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-6))',
    'hsl(var(--chart-7))',
    'hsl(var(--chart-8))',
  ];
  return (
    <Card className="flex flex-col transition-colors duration-200 hover:bg-gray-100">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart – Product Total Value</CardTitle>
        <CardDescription>Data from data.json</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <RePieChart width={400} height={400}>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="totalValue"
              nameKey="product"
              label
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            {/* <ChartLegend content={<ChartLegendContent nameKey="product" />} layout="horizontal" align="center" wrapperStyle={{ paddingTop: 20 }} /> */}
          </RePieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 8.4% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total value of products
        </div>
      </CardFooter>
    </Card>
  );
}
