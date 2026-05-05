import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WrenchIcon, CalendarDaysIcon, AlertTriangleIcon, PackageCheckIcon, SettingsIcon } from 'lucide-react'

export default function OperationDashboard() {
  const metrics = [
    {
      title: 'Mantenimientos Activos',
      value: '12',
      description: 'En curso actualmente',
      icon: <WrenchIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Órdenes de Trabajo',
      value: '8',
      description: 'Pendientes de asignación',
      icon: <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Alertas de Equipos',
      value: '3',
      description: 'Requieren revisión urgente',
      icon: <AlertTriangleIcon className="h-4 w-4 text-red-500" />,
    },
    {
      title: 'Equipos Reparados',
      value: '45',
      description: 'Este mes',
      icon: <PackageCheckIcon className="h-4 w-4 text-green-500" />,
    },
  ]

  const recentOrders = [
    { id: 'OT-001', equipo: 'Excavadora CAT 320', status: 'En Progreso', priority: 'Alta' },
    { id: 'OT-002', equipo: 'Cargador Frontal WA380', status: 'Pendiente', priority: 'Media' },
    { id: 'OT-003', equipo: 'Volquete Volvo FMX', status: 'Revisión', priority: 'Baja' },
    { id: 'OT-004', equipo: 'Tractor D8T', status: 'Completado', priority: 'Media' },
  ]

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard de Operaciones</h1>
        <p className="text-sm text-muted-foreground">
          Resumen en tiempo real del estado de mantenimientos y órdenes de trabajo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Órdenes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{order.id}</span>
                    <span className="text-xs text-muted-foreground">{order.equipo}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {order.status}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      order.priority === 'Alta' ? 'text-red-500' :
                      order.priority === 'Media' ? 'text-yellow-500' : 'text-blue-500'
                    }`}>
                      {order.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border shadow-sm bg-muted/20 flex flex-col items-center justify-center min-h-[300px]">
          <SettingsIcon className="size-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            El sistema de telemetría de equipos se encuentra sincronizado correctamente.
          </p>
        </Card>
      </div>
    </div>
  )
}
