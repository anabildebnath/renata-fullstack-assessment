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

// Data provided by the user
const monthlySalesData = [
  { month: 'January',   sales: 100000  },
  { month: 'February',  sales: 200000  },
  { month: 'March',     sales: 312000  },
  { month: 'April',     sales: 400000  },
  { month: 'May',       sales: 500000  },
  { month: 'June',      sales: 600000  },
  { month: 'July',      sales: 700000  },
  { month: 'August',    sales: 800000  },
  { month: 'September', sales: 900000  },
  { month: 'October',   sales: 1000000 },
  { month: 'November',  sales: 5100000 },
  { month: 'December',  sales: 10000000 }
];

// Gauge segments
const gaugeData = [
  { name: 'Low',    value: 3000000, color: '#EF4444' },
  { name: 'Medium', value: 4000000, color: '#F59E0B' },
  { name: 'High',   value: 3000000, color: '#3B82F6' }
];

const MAX_GAUGE_VALUE = 10000000;

// Needle component
function Needle({ value, cx, cy, innerRadius, outerRadius, color }) {
  const startAngle = 234;
  const endAngle   = -54;

  const [animatedAngle, setAnimatedAngle] = useState(startAngle);
  const previousValue = useRef(value);
  const raf = useRef(null);

  const targetAngle = useMemo(() => {
    if (value == null) return startAngle;
    const range = ((endAngle - startAngle) + 360) % 360;
    return (startAngle + (value / MAX_GAUGE_VALUE) * (range < 0 ? range + 360 : range)) % 360;
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
          {monthlySalesData.map(item => (
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
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-center pt-6">
        <div className="relative w-full max-w-sm aspect-square">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                startAngle={234}
                endAngle={-54}
                innerRadius={80}
                outerRadius={100}
                paddingAngle={2}
                cornerRadius={4}
              >
                {pieChartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              {/* Always‑visible needle */}
              <Needle
                value={selectedSales ?? 0}
                cx={0.5}      // relative units not supported here; we’ll absolute-position below
                cy={1}        // but we wrap inside ResponsiveContainer so override:
                color="#333"
                innerRadius={80}
                outerRadius={100}
              />
              <Tooltip cursor={false} />
            </PieChart>
          </ResponsiveContainer>

          {/* Overlay actual absolute needle via transform */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <Needle
              value={selectedSales ?? 0}
              cx={100} cy={100}
              innerRadius={50}
              outerRadius={90}
              color="#333"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
