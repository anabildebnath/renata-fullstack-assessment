"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import salesData from '../data/task2-data.json';

const { monthlySales, ranges } = salesData;
const MAX_GAUGE_VALUE = 10000000;

const gaugeData = [
  { name: 'Low', value: 33.33, color: '#EF4444' },    // First third (-45° to 45°)
  { name: 'Medium', value: 33.33, color: '#F59E0B' }, // Second third (45° to 135°)
  { name: 'High', value: 33.34, color: '#3B82F6' }    // Final third (135° to 225°)
];

const getCategory = (value) => {
  if (value <= ranges.low) return 'Low';
  if (value <= ranges.medium) return 'Medium';
  return 'High';
};


const mapValueToAngle = (value) => {
  if (value <= ranges.low) {
    // Low: 225° (left-bottom) to 315° (right-top, -45°)
    const percentage = value / ranges.low;
    return 225 + (percentage * 90); // 225° to 315°
  } else if (value <= ranges.medium) {
    // Medium: 315° (-45°) to 45° (top)
    const percentage = (value - ranges.low) / (ranges.medium - ranges.low);
    return 315 + (percentage * 90); // 315° to 45° (wraps around)
  } else {
    // High: 45° (top) to 135° (left-top)
    const percentage = (value - ranges.medium) / (MAX_GAUGE_VALUE - ranges.medium);
    return 45 + (percentage * 90); // 45° to 135°
  }
};

// Normalize angle to [-135, 225] for SVG (since 315° == -45°)
const normalizeAngle = (angle) => {
  if (angle > 225) return angle - 360;
  return angle;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const value = payload[0].payload.value;
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p>{`Category: ${payload[0].payload.name}`}</p>
        <p>{`Range: ${(value / 1000000).toFixed(1)}M`}</p>
      </div>
    );
  }
  return null;
};

// Needle component
function Needle({ value, cx, cy, innerRadius, outerRadius, color }) {
  const startAngle = 225;   // Start at 225 degrees (lowest left)
  const endAngle = 135;     // End at 135 degrees (highest left)
  
  const [animatedAngle, setAnimatedAngle] = useState(startAngle);
  const previousValue = useRef(value);
  const raf = useRef(null);

  const targetAngle = useMemo(() => {
    if (value == null) return startAngle;
    const angle = mapValueToAngle(value);
    return normalizeAngle(angle);
  }, [value]);

  useEffect(() => {
    const duration = 800;
    const t0 = performance.now();
    const from = animatedAngle;
    const to   = targetAngle;

    function animate(now) {
      const elapsed = now - t0;
      const t = Math.min(elapsed / duration, 1);
      setAnimatedAngle(from + (to - from) * t);
      if (t < 1) raf.current = requestAnimationFrame(animate);
    }

    if (value !== previousValue.current) {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(animate);
      previousValue.current = value;
    } else {
      setAnimatedAngle(targetAngle);
    }

    return () => cancelAnimationFrame(raf.current);
  }, [targetAngle, value]);

  // Compute tip
  const radius = (innerRadius + outerRadius) / 2;
  const rad = (animatedAngle - 90) * (Math.PI / 180);
  const tipX = cx + Math.cos(rad) * radius;
  const tipY = cy + Math.sin(rad) * radius;

  return (
    <g>
      <line
        x1={cx} y1={cy}
        x2={tipX} y2={tipY}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={6} fill={color} />
    </g>
  );
}

export default function GaugeChart() {
  const [selectedSales, setSelectedSales] = useState(null);
  const pieChartData = useMemo(() => gaugeData, []);

  return (
    <Card className="flex flex-col lg:flex-row">
      <CardHeader className="flex-shrink-0 lg:w-1/4 pb-0 lg:pb-6">
        <CardTitle className="text-xl mb-4 text-center lg:text-left">
          Months
        </CardTitle>
        <div className="flex flex-wrap lg:flex-col gap-2 justify-center lg:justify-start">
          {monthlySales.map(item => (
            <Button
              key={item.month}
              onClick={() => setSelectedSales(item.sales)}
              className={`w-24 lg:w-full text-center ${
                selectedSales === item.sales
                  ? 'bg-black text-white hover:bg-black'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {item.month}
              {selectedSales === item.sales && (
                <span className="ml-2">({getCategory(item.sales)})</span>
              )}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-center pt-6">
        <div className="relative w-full max-w-md aspect-square"> {/* Changed from max-w-sm to max-w-md */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                startAngle={-45}
                endAngle={225}
                innerRadius={120}    // Increased from 80
                outerRadius={150}    // Increased from 100
                paddingAngle={2}
                cornerRadius={4}
              >
                {pieChartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Needle
                value={selectedSales ?? 0}
                cx={0.5}
                cy={1}
                color="#333"
                innerRadius={135}    // Increased to make needle shorter
                outerRadius={150}
              />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <Needle
              value={selectedSales ?? 0}
              cx={100} cy={100}
              innerRadius={110}    // Increased to make needle shorter
              outerRadius={140}
              color="#333"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
