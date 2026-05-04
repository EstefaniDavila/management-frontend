import React, { useMemo } from 'react'
import { useLeads } from '@/providers/advisor/LeadsContext'
import { useAdvisorQuotations } from '@/providers/advisor/AdvisorQuotationsContext'
import { UsersIcon, FileTextIcon, DollarSignIcon, TargetIcon } from 'lucide-react'

const ADVISORS = ['Juan Pérez', 'Carlos Ramírez', 'Luis Torres']

const AreaManagerDashboard = () => {
  const { leads } = useLeads()
  const { advisorQuotations } = useAdvisorQuotations()

  const teamMetrics = useMemo(() => {
    return ADVISORS.map(advisor => {
      const myLeads      = leads.filter(l => l.assigned_to === advisor)
      const myQuotations = advisorQuotations.filter(q => q.advisor === advisor)
      const approved     = myQuotations.filter(q => q.status === 'approved')
      const totalSales   = approved.reduce((s, q) => s + (q.amount || 0), 0)
      const conversion   = myQuotations.length ? ((approved.length / myQuotations.length) * 100).toFixed(1) : 0
      return { advisor, leads: myLeads.length, quotations: myQuotations.length, approved: approved.length, totalSales, conversion }
    })
  }, [leads, advisorQuotations])

  const totals = useMemo(() => ({
    leads:      leads.length,
    pending:    leads.filter(l => l.status === 'pending').length,
    quotations: advisorQuotations.length,
    sales:      advisorQuotations.filter(q => q.status === 'approved').reduce((s, q) => s + (q.amount || 0), 0),
  }), [leads, advisorQuotations])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-base font-semibold text-muted-foreground">Dashboard del Equipo Comercial</h1>
        <p className="text-xs text-muted-foreground">Métricas generales y desempeño por asesor</p>
      </div>

      {/* KPIs globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: UsersIcon,      label: 'Total leads',       value: totals.leads,                              color: 'text-blue-500'  },
          { icon: UsersIcon,      label: 'Sin asignar',       value: totals.pending,                            color: 'text-amber-500' },
          { icon: FileTextIcon,   label: 'Cotizaciones',      value: totals.quotations,                         color: 'text-purple-500'},
          { icon: DollarSignIcon, label: 'Ventas aprobadas',  value: `S/ ${totals.sales.toLocaleString()}`,     color: 'text-green-500' },
        ].map(card => (
          <div key={card.label} className="border rounded-xl bg-card shadow-sm p-4 flex flex-col gap-2">
            <card.icon className={`size-4 ${card.color}`}/>
            <span className="text-xl font-bold">{card.value}</span>
            <span className="text-xs text-muted-foreground">{card.label}</span>
          </div>
        ))}
      </div>

      {/* Tabla por asesor */}
      <div className="border rounded-xl bg-card shadow-sm">
        <div className="px-4 pt-4 pb-2 border-b">
          <p className="text-sm font-medium">Desempeño por Asesor</p>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {['Asesor', 'Leads', 'Cotizaciones', 'Aprobadas', 'Ventas', 'Conversión'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamMetrics.map((m, i) => (
                <tr key={m.advisor} className={`border-t hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                  <td className="px-3 py-2 font-medium">{m.advisor}</td>
                  <td className="px-3 py-2">{m.leads}</td>
                  <td className="px-3 py-2">{m.quotations}</td>
                  <td className="px-3 py-2">{m.approved}</td>
                  <td className="px-3 py-2">S/ {m.totalSales.toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${m.conversion}%` }}/>
                      </div>
                      <span className="text-xs">{m.conversion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AreaManagerDashboard