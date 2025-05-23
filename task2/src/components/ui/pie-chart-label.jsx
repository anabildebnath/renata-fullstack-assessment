"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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

export function PieChartLabel({ data = [] }) {
  const processChartData = (data) => {
    const divisionMap = data.reduce((acc, curr) => {
      if (!acc[curr.Division]) {
        acc[curr.Division] = {
          division: curr.Division,
          income: curr.Income,
        };
      } else if (curr.Income > acc[curr.Division].income) {
        acc[curr.Division].income = curr.Income;
      }
      return acc;
    }, {});

    return Object.entries(divisionMap).map(([division, data], index) => ({
      name: division,
      value: data.income,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  };

  const chartData = processChartData(data);

  const chartConfig = {
    value: {
      label: "Income",
    },
    ...chartData.reduce(
      (acc, curr, index) => ({
        ...acc,
        [curr.name]: {
          label: curr.name,
          color: `hsl(var(--chart-${index + 1}))`,
        },
      }),
      {}
    ),
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Highest Income by Division</CardTitle>
        <CardDescription>Division Income Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              label
              cx="50%"
              cy="50%"
              outerRadius={80}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Division Income Overview{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing highest income for each division
        </div>
      </CardFooter>
    </Card>
  );
}
