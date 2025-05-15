//File: src/components/section-cards.jsx
import React, { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

export function SectionCards({ data }) {
  const total = data.length
  const todayNew = useMemo(() => /* e.g. random or filter by date */  Math.floor(Math.random()*10), [])
  const freqDiv = useMemo(() => {
    const cnt = data.reduce((a,c)=>{ a[c.Division] = (a[c.Division]||0)+1; return a },{})
    return Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0][0]
  },[data])
  const median = arr => {
    const s=[...arr].sort((a,b)=>a-b)
    const m = Math.floor(s.length/2)
    return s.length%2 ? s[m] : (s[m-1]+s[m])/2
  }
  const medIncome = median(data.map(d=>d.Income||0))
  const medAge    = median(data.map(d=>d.Age))
  
  const cards = [
    { title:'Total Customers',   desc:`${total}` },
    { title:'New Today',         desc:`${todayNew}` },
    { title:'Top Division',      desc:freqDiv },
    { title:'Median (Age/Inc)',  desc:`${medAge.toFixed(1)}/${medIncome.toFixed(0)}` },
  ]
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(c=>(
        <Card key={c.title}>
          <CardHeader>
            <CardTitle>{c.title}</CardTitle>
            <CardDescription>{c.desc}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
