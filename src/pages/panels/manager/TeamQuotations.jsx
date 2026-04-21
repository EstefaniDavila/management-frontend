import React from 'react'
import { useAdvisorQuotations } from '@/providers/advisor/AdvisorQuotationsContext'
import { useSales } from '@/providers/SalesContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TbCheck, TbX } from 'react-icons/tb'

const statusColor = {
  draft:    'bg-gray-100 text-gray-700',
  sent:     'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const statusLabel = { draft: 'Borrador', sent: 'Enviada', approved: 'Aprobada', rejected: 'Rechazada' }

const typeLabel = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const TeamQuotations = () => {
  const { advisorQuotations, approveQuotation, rejectQuotation } = useAdvisorQuotations()
  const { createFromQuotation } = useSales()

  const handleApprove = (q) => {
    approveQuotation(q.id)
    if (q.quotation_type === 'machinery_sale' || q.quotation_type === 'parts_sale') {
      createFromQuotation({ ...q, code: q.code, equipment: q.equipment, document: '' })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-base font-semibold">Cotizaciones del Equipo</h1>
        <p className="text-xs text-muted-foreground">Revisa y aprueba las cotizaciones enviadas por los asesores</p>
      </div>

      <div className="border rounded-xl bg-card shadow-sm">
        <div className="px-4 pt-4 pb-2 border-b flex items-center justify-between">
          <p className="text-sm font-medium">Todas las cotizaciones</p>
          <span className="text-xs text-muted-foreground">
            {advisorQuotations.filter(q => q.status === 'sent').length} pendientes de revisión
          </span>
        </div>
        <div className="divide-y">
          {advisorQuotations.map(q => (
            <div key={q.id} className="px-4 py-3 flex items-start gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs">{q.code}</span>
                  <Badge className={`px-2 py-0.5 text-xs ${statusColor[q.status]}`}>
                    {statusLabel[q.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{typeLabel[q.quotation_type]}</span>
                </div>
                <p className="text-sm font-medium">{q.customer} — {q.equipment}</p>
                <p className="text-xs text-muted-foreground">
                  Asesor: {q.advisor} · S/ {q.amount.toLocaleString()} · {q.date}
                </p>
              </div>

              {q.status === 'sent' && (
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(q)}>
                    <TbCheck size={14} className="mr-1"/> Aprobar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => rejectQuotation(q.id)}>
                    <TbX size={14} className="mr-1"/> Rechazar
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamQuotations