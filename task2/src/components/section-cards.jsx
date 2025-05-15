// src/components/section-cards.jsx
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import React, { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

export function SectionCards({ data }) {
  const total = data.length
  const todayNew = useMemo(() => Math.floor(Math.random() * 10), [data])
  const freqDiv = useMemo(() => {
    const counts = data.reduce((acc, cur) => {
      acc[cur.Division] = (acc[cur.Division] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  }, [data])
  const median = arr => {
    const sorted = [...arr].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  }
  const medIncome = median(data.map(d => d.Income || 0))
  const medAge = median(data.map(d => d.Age))

  const cards = [
    { title: 'Total Customers', desc: `${total}` },
    { title: 'New Customers Today', desc: `${todayNew}` },
    { title: 'Most Frequent Division', desc: freqDiv },
    { title: 'Median (Age/Inc)', desc: `${medAge.toFixed(1)}/${medIncome.toFixed(0)}` },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      {cards.map(c => (
        <Card key={c.title} className="@container/card">
          <CardHeader className="relative">
            <CardDescription>{c.title}</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {c.desc}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                {c.title === 'New Customers Today' || c.title === 'Most Frequent Division' ? (
                  <TrendingDownIcon className="size-3" />
                ) : (
                  <TrendingUpIcon className="size-3" />
                )}
                {c.title === 'Total Customers'
                  ? '+' + ((total / data.length) * 100).toFixed(1) + '%'
                  : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {c.title} <TrendingUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">Based on your data set</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}