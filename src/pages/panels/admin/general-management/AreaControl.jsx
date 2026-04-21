import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TbPlus, TbCheck, TbAlertTriangle } from 'react-icons/tb'
import {
  ShoppingCartIcon, PackageIcon, WrenchIcon,
  AlertTriangleIcon, CheckCircleIcon, XCircleIcon,
  TrendingUpIcon, UsersIcon, FileTextIcon,
} from 'lucide-react'
import RegisterActionModal from '@/composables/admin/general-management/modals/RegisterActionModal'

// ── Fake data ──────────────────────────────────────────────

const areaMetrics = [
  {
    area:    'Marketing & Sales',
    icon:    ShoppingCartIcon,
    color:   'text-blue-500',
    bg:      'bg-blue-50 dark:bg-blue-950/20',
    border:  'border-blue-500/30',
    metrics: [
      { label: 'Cotizaciones este mes', value: 12,           icon: FileTextIcon    },
      { label: 'Órdenes completadas',   value: 8,            icon: CheckCircleIcon },
      { label: 'Clientes activos',      value: 24,           icon: UsersIcon       },
      { label: 'Ingresos del mes',      value: 'S/ 445,000', icon: TrendingUpIcon  },
    ],
    status: 'good',
  },
  {
    area:    'Logística & Almacén',
    icon:    PackageIcon,
    color:   'text-yellow-500',
    bg:      'bg-yellow-50 dark:bg-yellow-950/20',
    border:  'border-yellow-500/30',
    metrics: [
      { label: 'Productos en stock',    value: 148,  icon: PackageIcon       },
      { label: 'Stock bajo',            value: 5,    icon: AlertTriangleIcon },
      { label: 'Proveedores activos',   value: 12,   icon: UsersIcon         },
      { label: 'Despachos este mes',    value: 34,   icon: TrendingUpIcon    },
    ],
    status: 'warning',
  },
  {
    area:    'Producción & Operaciones',
    icon:    WrenchIcon,
    color:   'text-green-500',
    bg:      'bg-green-50 dark:bg-green-950/20',
    border:  'border-green-500/30',
    metrics: [
      { label: 'Mantenimientos activos',    value: 7,  icon: WrenchIcon        },
      { label: 'Pendientes',                value: 3,  icon: AlertTriangleIcon },
      { label: 'Completados este mes',      value: 18, icon: CheckCircleIcon   },
      { label: 'Equipos en mantenimiento',  value: 4,  icon: PackageIcon       },
    ],
    status: 'good',
  },
]

const fakeAlerts = [
  { id: 1, area: 'Logística & Almacén',        description: 'Stock mínimo alcanzado: Filtro aceite 1R-0750',      level: 'high',   date: '2026-04-18', resolved: false },
  { id: 2, area: 'Producción & Operaciones',   description: 'Mantenimiento preventivo vencido: Excavadora CAT 320', level: 'medium', date: '2026-04-17', resolved: false },
  { id: 3, area: 'Marketing & Sales',          description: '3 cotizaciones sin respuesta hace más de 5 días',    level: 'low',    date: '2026-04-15', resolved: false },
  { id: 4, area: 'Logística & Almacén',        description: 'Proveedor Volvo Parts SAC sin actividad 30 días',    level: 'low',    date: '2026-04-14', resolved: true  },
]

const fakeActions = [
  { id: 1, area: 'Logística & Almacén',      action: 'Emitir orden de compra para repuestos críticos', responsible: 'Carlos Mendoza', date: '2026-04-20', status: 'Pendiente',  alert_ref: 1 },
  { id: 2, area: 'Producción & Operaciones', action: 'Programar mantenimiento urgente CAT 320',        responsible: 'Pedro Gómez',    date: '2026-04-19', status: 'En proceso', alert_ref: 2 },
]

// ── Helpers ────────────────────────────────────────────────

const levelColor = {
  high:   'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  low:    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
}

const levelLabel = {
  high: 'Alta', medium: 'Media', low: 'Baja',
}

const statusColor = {
  'Pendiente':   'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'En proceso':  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Completado':  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
}

const areaStatusIcon = {
  good:    <CheckCircleIcon className="size-5 text-green-500" />,
  warning: <AlertTriangleIcon className="size-5 text-yellow-500" />,
  bad:     <XCircleIcon className="size-5 text-red-500" />,
}

// ── Componente ─────────────────────────────────────────────

const AreaControl = () => {
  const [alerts, setAlerts]     = useState(fakeAlerts)
  const [actions, setActions]   = useState(fakeActions)
  const [isActionOpen, setIsActionOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState(null)

  const handleResolve = (id) =>
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a))

  const handleCreateAction = (alert) => {
    setSelectedAlert(alert)
    setIsActionOpen(true)
  }

  const handleSaveAction = (newAction) => {
    setActions(prev => [{
      ...newAction,
      id: Date.now(),
      status: 'Pendiente',
      alert_ref: selectedAlert?.id || null
    }, ...prev])
    setSelectedAlert(null)
  }

  const handleCompleteAction = (id) =>
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'Completado' } : a))

  return (
    <>
      <div className="flex flex-col gap-8">

        {/* Título */}
        <div>
          <h1 className="text-lg font-semibold">Control de Áreas</h1>
          <p className="text-sm text-muted-foreground">Supervisión del desempeño y gestión de alertas por área</p>
        </div>

        {/* Tarjetas por área */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {areaMetrics.map(area => (
            <div key={area.area} className={`border-2 rounded-2xl shadow-md p-6 flex flex-col gap-4 ${area.border} ${area.bg}`}>
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-3">
                  <area.icon className={`size-6 ${area.color}`} />
                  <span className="text-sm font-semibold">{area.area}</span>
                </div>
                {areaStatusIcon[area.status]}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {area.metrics.map(m => (
                  <div key={m.label} className="flex flex-col gap-1.5 bg-background/50 border rounded-xl p-3">
                    <m.icon className="size-4 text-muted-foreground" />
                    <span className="text-lg font-bold">{m.value}</span>
                    <span className="text-xs text-muted-foreground leading-tight">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Alertas */}
        <div className="border rounded-2xl bg-card shadow-md">
          <div className="px-6 pt-5 pb-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TbAlertTriangle className="size-5 text-yellow-500" />
              <p className="text-sm font-semibold">Alertas e Incumplimientos</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {alerts.filter(a => !a.resolved).length} activas
            </Badge>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-4">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`flex items-start justify-between p-4 rounded-xl border gap-4 transition-all ${
                    alert.resolved
                      ? 'bg-muted/30 opacity-50'
                      : 'bg-background hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`px-2 py-1 text-xs font-medium ${levelColor[alert.level]}`}>
                        {levelLabel[alert.level]}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">{alert.area}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{alert.date}</span>
                    </div>
                    <span className="text-sm leading-relaxed">{alert.description}</span>
                  </div>
                  <div className="flex gap-2">
                    {!alert.resolved && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleCreateAction(alert)}>
                          <TbPlus size={14} className="mr-1" /> Acción
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleResolve(alert.id)}>
                          <TbCheck size={14} className="mr-1" /> Resolver
                        </Button>
                      </>
                    )}
                    {alert.resolved && (
                      <span className="text-xs text-green-600 font-semibold whitespace-nowrap self-center">✓ Resuelto</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Acciones correctivas */}
        <div className="border rounded-2xl bg-card shadow-md">
          <div className="px-6 pt-5 pb-3 border-b flex items-center justify-between">
            <p className="text-sm font-semibold">Acciones Correctivas</p>
            <Button size="sm" onClick={() => { setSelectedAlert(null); setIsActionOpen(true) }}>
              <TbPlus size={14} className="mr-1" /> Registrar Acción
            </Button>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {['Área', 'Acción', 'Responsable', 'Fecha límite', 'Estado', 'Origen', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {actions.map((a, i) => {
                    const linkedAlert = alerts.find(alert => alert.id === a.alert_ref)
                    return (
                      <tr key={a.id} className={`border-t hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{a.area}</td>
                        <td className="px-4 py-3 max-w-xs">{a.action}</td>
                        <td className="px-4 py-3">{a.responsible}</td>
                        <td className="px-4 py-3">{a.date}</td>
                        <td className="px-4 py-3">
                          <Badge className={`px-2 py-1 text-xs font-medium ${statusColor[a.status]}`}>
                            {a.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {linkedAlert ? `Alerta #${linkedAlert.id}` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          {a.status !== 'Completado' && (
                            <Button size="sm" variant="outline" onClick={() => handleCompleteAction(a.id)}>
                              <TbCheck size={14} className="mr-1" /> Completar
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <RegisterActionModal
        isOpen={isActionOpen}
        handleClose={() => { setIsActionOpen(false); setSelectedAlert(null) }}
        onSave={handleSaveAction}
        alert={selectedAlert}
      />
    </>
  )
}

export default AreaControl