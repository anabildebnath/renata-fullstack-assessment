import React from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { Component as GradientChart } from "@/components/chart-area-gradient";
import { BarChartComponent } from "@/components/ui/bar-chart";
import { InteractiveBarChart } from "@/components/ui/interactive-bar-chart";
import { StackedBarChart } from "@/components/ui/stacked-bar-chart";
import { RadialChartText } from "@/components/ui/radial-chart-text";
import { RadialChartShape } from "@/components/ui/radial-chart-shape";
import { RadialChartStacked } from "@/components/ui/radial-chart-stacked";
import { RadialChartLabel } from "@/components/ui/radial-chart-label";
import { RadarChartLines } from "@/components/ui/radar-chart-lines";
import { RadarChartGrid } from "@/components/ui/radar-chart-grid";
import { PieChartInteractive } from "@/components/ui/pie-chart-interactive";
import { PieChartLabel } from "@/components/ui/pie-chart-label";
import { LineChartInteractive } from "@/components/ui/line-chart-interactive";
import { LineChartLabel } from "@/components/ui/line-chart-label";
import { BarChartCustomLabel } from "@/components/ui/bar-chart-custom-label";

export default function AnalyticsPage({ data }) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      <p className="text-muted-foreground">Explore various insights from your data.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Division Metrics */}
        <ChartAreaInteractive data={data} />
        {/* Chart 2: Gradient Area Chart */}
        <GradientChart data={data} />
        {/* Chart 3: Bar Chart */}
        <BarChartComponent data={data} />
        {/* Chart 4: Stacked Bar Chart */}
        <StackedBarChart data={data} />
      </div>
      {/* Interactive Bar Chart */}
      <div className="mt-6">
        <InteractiveBarChart data={data} />
      </div>
      {/* Radial Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <RadialChartText data={data} />
        <RadialChartShape data={data} />
      </div>
      {/* Next Row of Radial Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <RadialChartStacked data={data} />
        <RadialChartLabel data={data} />
      </div>
      {/* Radar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <RadarChartLines data={data} />
        <RadarChartGrid data={data} />
      </div>
      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <PieChartInteractive data={data} />
        <PieChartLabel data={data} />
      </div>
      {/* Line Chart */}
      <div className="mt-6">
        <LineChartInteractive data={data} />
      </div>
      {/* Line Chart with Labels and Bar Chart with Custom Labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <LineChartLabel data={data} />
        <BarChartCustomLabel data={data} />
      </div>
    </div>
  );
}
