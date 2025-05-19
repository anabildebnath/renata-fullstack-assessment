import React from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { Component as GradientChart } from "@/components/chart-area-gradient";
import { BarChartComponent } from "@/components/ui/bar-chart";

export default function AnalyticsPage({ data }) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      <p className="text-muted-foreground">Explore various insights from your data.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Division Metrics */}
        <ChartAreaInteractive data={data} />
        {/* Chart 2: Gradient Area Chart */}
        <GradientChart />
        {/* Chart 3: Bar Chart */}
        <BarChartComponent />
      </div>
    </div>
  );
}
