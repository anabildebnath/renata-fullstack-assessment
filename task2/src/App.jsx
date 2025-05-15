import React from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SectionCards } from '@/components/section-cards'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import rawData from './data.json'

export default function App() {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background text-foreground">
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col p-6">
            <SectionCards data={rawData} />
            <div className="mt-6">
              <ChartAreaInteractive data={rawData} />
            </div>
            <div className="mt-6">
              <DataTable data={rawData} />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
