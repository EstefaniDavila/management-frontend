import React, { useState, useEffect } from 'react'
import useCrud from '@/hooks/useCrud'
import useEntityMutation from '@/hooks/useEntityMutation'
import { useSales } from '@/providers/SalesContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TbCheck, TbX } from 'react-icons/tb'
const statusColor = {
  draft:              'bg-gray-100 text-gray-700',
  sent:               'bg-blue-100 text-blue-800',
  pending_approval:   'bg-yellow-100 text-yellow-800',
  approved:           'bg-green-100 text-green-800',
  approved_internally:'bg-teal-100 text-teal-800',
  rejected:           'bg-red-100 text-red-800',
  web_request:        'bg-purple-100 text-purple-800',
  client_approved:    'bg-purple-100 text-purple-800',
}

const statusLabel = { 
  draft:               'Borrador', 
  sent:                'Enviada al Cliente', 
  pending_approval:    'Pendiente Aprob. Gerente', 
  approved:            'Aprobada Definitivamente',
  approved_internally: 'Aprobada Internamente',
  rejected:            'Rechazada',
  web_request:         '🌐 Web',
  client_approved:     '✅ Cliente Aprobó',
}

const typeLabel = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
  sale:           'Venta',
}

const TeamQuotations = () => {
  const { getModel } = useCrud('/api/v1/manager/quotations')
  const quotationMutation = useEntityMutation({ entityName: 'quotation' })
  const { createFromQuotation } = useSales()

  const [quotations, setQuotations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchQuotations = async () => {
    try {
      setIsLoading(true)
      const response = await getModel('?pageSize=1000') // Fetch all para la vista de tarjetas
      const quotesArray = response.quotations || []
      
      const formattedData = quotesArray.map(item => ({
        id: item.id,
        code: item.code || '-',
        customer: item.client_name || item.customer || 'Sin cliente',
        quotation_type: item.quotation_type,
        advisor: item.advisor_name || item.advisor || 'Sin asignar',
        amount: item.total || item.subtotal || 0,
        subtotal: item.subtotal || 0,
        tax: item.tax || 0,
        items: item.items || [],
        lead_description: item.lead_description || '',
        date: item.created_at,
        status: item.status,
        _original: item
      }))

      setQuotations(formattedData)
    } catch (error) {
      console.error("Error al cargar cotizaciones del equipo:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotations()
  }, [])

  const handleApprove = (q) => {
    quotationMutation.mutate({
      action: 'update',
      id: q.id,
      endpoint: `/api/v1/manager/quotations/${q.id}/approve`
    }, {
      onSuccess: () => fetchQuotations()
    })
  }

  // Aprobación Final: cuando el cliente ya aprobó → genera la orden operativa
  const handleFinalApprove = (id) => {
    quotationMutation.mutate({
      action: 'update',
      id,
      endpoint: `/api/v1/manager/quotations/${id}/final_approve`
    }, {
      onSuccess: (data) => {
        fetchQuotations()
        const msg = data?.message || 'Orden generada exitosamente'
        alert(`✅ ${msg}`)
      },
      onError: (err) => {
        alert(`❌ Error: ${err?.message || 'No se pudo generar la orden'}`)
      }
    })
  }

  const handleReject = (id) => {
    quotationMutation.mutate({
      action: 'update',
      id,
      endpoint: `/api/v1/manager/quotations/${id}/reject`
    }, {
      onSuccess: () => fetchQuotations()
    })
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
            {quotations.filter(q => q.status === 'pending_approval' || q.status === 'sent').length} pendientes de revisión
          </span>
        </div>
        <div className="divide-y">
          {quotations.length === 0 && !isLoading && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No hay cotizaciones para mostrar.
            </div>
          )}
          {quotations.map(q => (
            <div key={q.id} className="px-4 py-3 flex items-start gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs">{q.code}</span>
                  <Badge className={`px-2 py-0.5 text-xs ${statusColor[q.status] || 'bg-gray-100 text-gray-800'}`}>
                    {statusLabel[q.status] || q.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{typeLabel[q.quotation_type] || q.quotation_type}</span>
                </div>
                <p className="text-sm font-medium">{q.customer}</p>
                <p className="text-xs text-muted-foreground">
                  Asesor: <span className="font-semibold text-foreground">{q.advisor}</span> · S/ {parseFloat(q.amount).toLocaleString()} · {q.date}
                </p>
              </div>

              {/* Aprobación Final → genera la orden operativa */}
              {(q.status === 'pending_approval' || q.status === 'client_approved' || q.status === 'approved_internally') && (
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white" onClick={() => handleFinalApprove(q.id)}>
                    <TbCheck size={14} className="mr-1"/> Aprobación Final → Orden
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReject(q.id)}>
                    <TbX size={14} className="mr-1"/> Rechazar
                  </Button>
                </div>
              )}
              {/* Para los demás estados activos (ej. sent): solo puede rechazar */}
              {q.status === 'sent' && (
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => handleReject(q.id)}>
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