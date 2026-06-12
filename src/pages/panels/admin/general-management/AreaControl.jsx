import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TbPlus, TbCheck, TbAlertTriangle } from 'react-icons/tb'
import {
  ShoppingCartIcon, PackageIcon, WrenchIcon,
  AlertTriangleIcon, CheckCircleIcon, XCircleIcon,
  TrendingUpIcon, UsersIcon, FileTextIcon,
} from 'lucide-react'
import RegisterActionModal from '@/composables/admin/general-management/modals/RegisterActionModal'
import useCrud from '@/hooks/useCrud'
import RenderProfiler from '@/components/RenderProfiler'

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

const iconMap = {
  ShoppingCartIcon, PackageIcon, WrenchIcon,
  AlertTriangleIcon, CheckCircleIcon, XCircleIcon,
  TrendingUpIcon, UsersIcon, FileTextIcon
}

// ── Componente ─────────────────────────────────────────────

const AreaControl = () => {
  const { getModel } = useCrud('/api/v1/admin/area_control')
  
  const [areaMetrics, setAreaMetrics] = useState([])
  const [alerts, setAlerts]     = useState([])
  const [actions, setActions]   = useState([])
  const [isActionOpen, setIsActionOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAreaControlData = async () => {
      try {
        const response = await getModel('')
        const rawMetrics = response.area_metrics || response.areaMetrics || []
        
        // Map icon strings to actual Icon components
        const mappedMetrics = rawMetrics.map(area => ({
          ...area,
          icon: iconMap[area.icon] || PackageIcon,
          metrics: area.metrics?.map(m => ({
            ...m,
            icon: iconMap[m.icon] || FileTextIcon
          })) || []
        }))

        setAreaMetrics(mappedMetrics)
        setAlerts(response.alerts || [])
        setActions(response.actions || [])
      } catch (error) {
        console.error("Error fetching area control data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAreaControlData()
  }, [])

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
    
    // Conectar con Solicitudes entre Áreas
    const storedReqs = JSON.parse(localStorage.getItem('area_requests_data') || '[]')
    
    // Algunos items iniciales predeterminados si localStorage estaba vacío, para evitar pérdida
    const defaults = [
      { id: 'REQ-001', from: 'Comercial', to: 'Operaciones', type: 'Completar Cotización', status: 'Pendiente', date: '2024-10-12', detail: 'Faltan datos del cliente para alquiler' },
      { id: 'REQ-002', from: 'Operaciones', to: 'Logística', type: 'Revisión Técnica', status: 'En Progreso', date: '2024-10-14', detail: 'Revisar repuestos para mantenimiento' },
      { id: 'REQ-003', from: 'Admin', to: 'Comercial', type: 'Actualización Datos', status: 'Completado', date: '2024-10-15', detail: 'Actualizar pipeline' },
    ];
    
    const baseReqs = storedReqs.length > 0 ? storedReqs : defaults;
    
    const newReq = {
      id: `REQ-${Math.floor(Math.random() * 9000) + 1000}`,
      from: 'Admin',
      to: newAction.area.split(' ')[0], // Ejemplo: "Logística & Almacén" -> "Logística"
      type: 'Acción Correctiva',
      status: 'Pendiente',
      date: newAction.date,
      detail: newAction.action,
    }
    
    localStorage.setItem('area_requests_data', JSON.stringify([newReq, ...baseReqs]))
    window.dispatchEvent(new Event('requests_updated'))
    
    setSelectedAlert(null)
  }

  const handleCompleteAction = (id) =>
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'Completado' } : a))

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando métricas de áreas...</div>
  }

  return (
    <>
      <RenderProfiler id="Admin-AreaControl-Dashboard">
        <div className="flex flex-col gap-8">

          {/* Título */}
          <div>
            <h1 className="text-lg font-semibold">Control de Áreas</h1>
            <p className="text-sm text-muted-foreground">Supervisión del desempeño y gestión de alertas por área en tiempo real</p>
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
      </RenderProfiler>

      <RenderProfiler id="Admin-ActionRequest-Modal">
        <RegisterActionModal
          isOpen={isActionOpen}
          handleClose={() => { setIsActionOpen(false); setSelectedAlert(null) }}
          onSave={handleSaveAction}
          alert={selectedAlert}
        />
      </RenderProfiler>
    </>
  )
}

export default AreaControl