//File: src/components/chart-area-interactive.jsx
"use client"
import React from 'react'
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function ChartAreaInteractive({ data }) {
  // show count by division
  const grouped = data.reduce((a,c)=>{
    a[c.Division] = (a[c.Division]||0) + 1; return a
  },{})
  const chartData = Object.entries(grouped).map(([division,count])=>({ division, count }))
  
  return (
    <Card>
      <CardHeader><CardTitle>Customers by Division</CardTitle></CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: 0, top: 10, right: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="division" />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="var(--primary)" fill="var(--primary)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
