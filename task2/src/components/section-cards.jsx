// src/components/section-cards.jsx
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import React, { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

export function SectionCards({ data = [] }) {
  // Always show cards with default/empty values
  const total = data.length;
  const todayNew = React.useMemo(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    return data.filter((record) => {
      const addedAtDate = record.addedAt?.split("T")[0]; // Extract the date part of the timestamp
      return addedAtDate === today; // Check if the record was added today
    }).length; // Count records added today
  }, [data]); // Recalculate when `data` changes

  const freqDiv = React.useMemo(() => {
    if (!data.length) return "No data"; // Changed from "N/A"
    const counts = data.reduce((acc, cur) => {
      if (cur.Division) {
        acc[cur.Division] = (acc[cur.Division] || 0) + 1;
      }
      return acc;
    }, {});
    const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sortedEntries.length > 0 ? sortedEntries[0][0] : "No data"; // Fallback to "No data" if no divisions
  }, [data]);

  const calculateMedian = (arr) => {
    // Filter out undefined/null values and convert to numbers
    const validNumbers = arr
      .filter(val => val !== undefined && val !== null)
      .map(Number)
      .filter(num => !isNaN(num))
      .sort((a, b) => a - b);

    if (validNumbers.length === 0) return 0;

    const mid = Math.floor(validNumbers.length / 2);
    return validNumbers.length % 2 !== 0
      ? validNumbers[mid]
      : (validNumbers[mid - 1] + validNumbers[mid]) / 2;
  };

  // Calculate medians from raw data
  const medianAge = React.useMemo(() => {
    const ages = data.map(item => item.Age);
    return calculateMedian(ages);
  }, [data]);

  const medianIncome = React.useMemo(() => {
    const incomes = data.map(item => item.Income);
    return calculateMedian(incomes);
  }, [data]);

  const cards = [
    { 
      title: "Total Customers", 
      desc: `${total}`,
      empty: "0",
      trend: "neutral"
    },
    { 
      title: "New Customers Today", 
      desc: `${todayNew}`,
      empty: "0",
      trend: "neutral"
    },
    { 
      title: "Most Frequent Division", 
      desc: freqDiv,
      empty: "No divisions yet",
      trend: "neutral"
    },
    { 
      title: "Median (Age/Income)", 
      desc: data.length ? `${medianAge.toFixed(1)}/${medianIncome.toLocaleString()}` : "0/0",
      empty: "0/0",
      trend: "neutral"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      {cards.map((c) => (
        <Card key={c.title} className="@container/card">
          <CardHeader className="relative">
            <CardDescription>{c.title}</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {data.length ? c.desc : c.empty}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className="flex gap-1 rounded-[var(--radius)] text-xs bg-[oklch(var(--muted))] text-[oklch(var(--muted-foreground))]"
              >
                {c.trend === "down" ? (
                  <TrendingDownIcon className="size-3 text-[oklch(var(--destructive))]" />
                ) : c.trend === "up" ? (
                  <TrendingUpIcon className="size-3 text-[oklch(var(--chart-1))]" />
                ) : (
                  <span>•</span> // Neutral indicator
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              {data.length ? "Based on your data set" : "No data available"}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}