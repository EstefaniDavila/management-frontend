import React, { useMemo } from 'react'
import { useLeads } from '@/providers/advisor/LeadsContext'
import { useAdvisorQuotations } from '@/providers/advisor/AdvisorQuotationsContext'
import { DollarSignIcon, FileTextIcon, UsersIcon, TargetIcon, TrendingUpIcon } from 'lucide-react'

const CURRENT_ADVISOR = 'Juan Pérez'
const META_MENSUAL    = 500000

const AdvisorDashboard = () => {
  const { leads } = useLeads()
  const { advisorQuotations } = useAdvisorQuotations()

  const myLeads      = leads.filter(l => l.assigned_to === CURRENT_ADVISOR)
  const myQuotations = advisorQuotations.filter(q => q.advisor === CURRENT_ADVISOR)

  const metrics = useMemo(() => {
    const approved     = myQuotations.filter(q => q.status === 'approved')
    const totalSales   = approved.reduce((s, q) => s + (q.amount || 0), 0)
    const conversion   = myQuotations.length ? ((approved.length / myQuotations.length) * 100).toFixed(1) : 0
    const progress     = Math.min(((totalSales / META_MENSUAL) * 100).toFixed(1), 100)
    return { totalSales, totalQuotations: myQuotations.length, approved: approved.length, leads: myLeads.length, conversion, progress }
  }, [myLeads, myQuotations])

  const cards = [
    { icon: DollarSignIcon, label: 'Ventas aprobadas',  value: `S/ ${metrics.totalSales.toLocaleString()}`, color: 'text-green-500' },
    { icon: FileTextIcon,   label: 'Cotizaciones',      value: metrics.totalQuotations,                     color: 'text-blue-500'  },
    { icon: UsersIcon,      label: 'Leads asignados',   value: metrics.leads,                               color: 'text-purple-500'},
    { icon: TargetIcon,     label: 'Tasa conversión',   value: `${metrics.conversion}%`,                    color: 'text-amber-500' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-base font-semibold">Mi Panel Comercial</h1>
        <p className="text-xs text-muted-foreground">Bienvenido, {CURRENT_ADVISOR} — aquí está tu resumen del mes</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="border rounded-xl bg-card shadow-sm p-4 flex flex-col gap-2">
            <card.icon className={`size-4 ${card.color}`}/>
            <span className="text-xl font-bold">{card.value}</span>
            <span className="text-xs text-muted-foreground">{card.label}</span>
          </div>
        ))}
      </div>

      {/* Meta del mes */}
      <div className="border rounded-xl bg-card shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="size-4 text-muted-foreground"/>
            <p className="text-sm font-medium">Meta mensual</p>
          </div>
          <span className="text-xs text-muted-foreground">
            S/ {metrics.totalSales.toLocaleString()} / S/ {META_MENSUAL.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all"
            style={{ width: `${metrics.progress}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{metrics.progress}% alcanzado</span>
      </div>

      {/* Resumen por estado */}
      <div className="border rounded-xl bg-card shadow-sm">
        <div className="px-4 pt-4 pb-2 border-b">
          <p className="text-sm font-medium">Estado de mis cotizaciones</p>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Borrador',  key: 'draft',    color: 'bg-gray-100 text-gray-700'   },
            { label: 'Enviadas',  key: 'sent',     color: 'bg-blue-100 text-blue-800'   },
            { label: 'Aprobadas', key: 'approved', color: 'bg-green-100 text-green-800' },
            { label: 'Rechazadas',key: 'rejected', color: 'bg-red-100 text-red-800'     },
          ].map(s => (
            <div key={s.key} className={`rounded-lg p-3 text-center ${s.color}`}>
              <p className="text-xl font-bold">{myQuotations.filter(q => q.status === s.key).length}</p>
              <p className="text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdvisorDashboard