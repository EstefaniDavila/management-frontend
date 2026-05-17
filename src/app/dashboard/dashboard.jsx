import React, { useState, useEffect } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import useCrud from '@/hooks/useCrud'

export default function Page() {
  const { getModel } = useCrud('/api/v1/admin/dashboard')
  const [data, setData] = useState({
    stats: { total_sales: 0, total_quotations: 0, total_leads: 0, total_clients: 0 },
    chart_data: [],
    recent_activity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getModel('')
        setData(response)
      } catch (error) {
        console.error("Error fetching dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando métricas...</div>
  }

  return (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <h1>Dashboard</h1>
              <SectionCards stats={data.stats} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive chartData={data.chart_data} />
              </div>
              <DataTable data={data.recent_activity} />
            </div>
          </div>
        </div>
  )
}