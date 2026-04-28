import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Wrench, 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const TechnicianDashboard = () => {
  // Fake metrics
  const metrics = [
    {
      title: "Órdenes Pendientes",
      value: "4",
      description: "Por iniciar",
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      trend: "Urgentes: 2"
    },
    {
      title: "En Proceso",
      value: "1",
      description: "Trabajando actualmente",
      icon: <Wrench className="h-5 w-5 text-blue-500" />,
      trend: "WO-000001"
    },
    {
      title: "Programadas Hoy",
      value: "3",
      description: "Asignadas para hoy",
      icon: <CalendarClock className="h-5 w-5 text-purple-500" />,
      trend: "14:00 - Próxima"
    },
    {
      title: "Completadas (Semana)",
      value: "12",
      description: "Órdenes finalizadas",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      trend: "+3 vs semana pasada"
    }
  ]

  // Fake urgent tasks
  const urgentTasks = [
    { id: 'WO-000001', equipment: 'Excavadora CAT 320', issue: 'Pérdida de potencia hidráulica', status: 'En Proceso', priority: 'Alta', time: '08:00 AM' },
    { id: 'WO-000007', equipment: 'Perforadora Atlas Copco', issue: 'Falla en sistema de enfriamiento', status: 'Pendiente', priority: 'Crítica', time: '11:30 AM' },
    { id: 'WO-000011', equipment: 'Excavadora Komatsu PC200', issue: 'Mantenimiento Preventivo 500H', status: 'Pendiente', priority: 'Media', time: '14:00 PM' },
  ]

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel de Técnico</h1>
          <p className="text-muted-foreground text-sm mt-1">Bienvenido, Juan Perez. Este es el resumen de tus actividades asignadas.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 px-3 py-1.5 flex gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>2 Órdenes Urgentes</span>
          </Badge>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <Card key={i} className="shadow-sm hover:shadow-md transition-shadow border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className="p-2 bg-muted/50 rounded-full">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{metric.description}</p>
                <p className="text-[10px] font-semibold text-primary">{metric.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lista de Tareas */}
        <Card className="lg:col-span-2 shadow-sm border-border/50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div>
              <CardTitle className="text-base">Mi Agenda de Hoy</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Órdenes que requieren tu atención inmediata</p>
            </div>
            <Link to="/technician/work-orders">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Ver todas <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-border/50">
              {urgentTasks.map((task, i) => (
                <div key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-2 w-2 rounded-full flex-shrink-0 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-medium text-muted-foreground">{task.id}</span>
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 border-transparent ${
                          task.priority === 'Crítica' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' :
                          task.priority === 'Alta' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                        }`}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold">{task.equipment}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.issue}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Hora</span>
                      <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md">{task.time}</span>
                    </div>
                    <Link to={`/technician/work-orders/${task.id.split('-')[1]}`}>
                      <Button size="sm" className="h-8 text-xs">Atender</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Panel lateral: Acciones rápidas y Alertas */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-sm border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link to="/technician/schedule" className="w-full">
                <Button variant="outline" className="w-full justify-start gap-2 h-10 shadow-sm bg-background hover:bg-muted/50 transition-colors">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  Revisar Cronograma
                </Button>
              </Link>
              <Link to="/technician/work-orders" className="w-full">
                <Button variant="outline" className="w-full justify-start gap-2 h-10 shadow-sm bg-background hover:bg-muted/50 transition-colors">
                  <Wrench className="h-4 w-4 text-primary" />
                  Ver Todas las Órdenes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Avisos de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 p-4 rounded-lg">
                <p className="font-semibold text-amber-900 dark:text-amber-300 mb-1">Campaña de Verano</p>
                <p className="text-amber-800/80 dark:text-amber-400/80 text-xs leading-relaxed">
                  Recuerda verificar los niveles de refrigerante en todos los equipos de la serie 320 antes de entregarlos a Operaciones debido a las altas temperaturas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default TechnicianDashboard
