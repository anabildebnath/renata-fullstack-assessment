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
import { ChartErrorBoundary } from "@/components/ChartErrorBoundary";

export default function AnalyticsPage({ data = [] }) {
  // Basic validation
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      <p className="text-muted-foreground">
        Explore various insights from your data.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartErrorBoundary>
          <ChartAreaInteractive data={safeData} />
        </ChartErrorBoundary>
        <ChartErrorBoundary>
          <GradientChart data={safeData} />
        </ChartErrorBoundary>
        <ChartErrorBoundary>
          <BarChartComponent data={safeData} />
        </ChartErrorBoundary>
        <ChartErrorBoundary>
          <StackedBarChart data={safeData} />
        </ChartErrorBoundary>
      </div>
      {/* Interactive Bar Chart */}
      <div className="mt-6">
        <InteractiveBarChart data={safeData} />
      </div>
      {/* Radial Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <ChartErrorBoundary>
          <RadialChartText data={safeData} />
        </ChartErrorBoundary>
        <ChartErrorBoundary>
          <RadialChartShape data={safeData} />
        </ChartErrorBoundary>
      </div>
      {/* Next Row of Radial Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <ChartErrorBoundary>
          <RadialChartStacked data={safeData} />
        </ChartErrorBoundary>
        <ChartErrorBoundary>
          <RadialChartLabel data={safeData} />
        </ChartErrorBoundary>
      </div>
      {/* Radar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <ChartErrorBoundary>
          <RadarChartLines data={safeData} />
        </ChartErrorBoundary>
        <ChartErrorBoundary>
          <RadarChartGrid data={safeData} />
        </ChartErrorBoundary>
      </div>
      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <ChartErrorBoundary>
          <PieChartInteractive data={safeData} />
        </ChartErrorBoundary>
        <ChartErrorBoundary>
          <PieChartLabel data={safeData} />
        </ChartErrorBoundary>
      </div>

      {/* Line Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <ChartErrorBoundary>
          <LineChartLabel data={safeData} />
        </ChartErrorBoundary>
        <ChartErrorBoundary>
          <BarChartCustomLabel data={safeData} />
        </ChartErrorBoundary>
      </div>
    </div>
  );
}
