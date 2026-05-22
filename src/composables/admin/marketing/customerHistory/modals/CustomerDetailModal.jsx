import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileTextIcon, ShoppingCartIcon, DollarSignIcon, Loader2 } from 'lucide-react'
import useCrud from '@/hooks/useCrud'

const statusColor = {
  pending:  'bg-yellow-200 text-yellow-800',
  client_accepted: 'bg-green-200 text-green-800',
  approved_internally: 'bg-green-200 text-green-800',
  rejected: 'bg-red-200 text-red-800',
  Pending:  'bg-yellow-200 text-yellow-800',
  Approved: 'bg-green-200 text-green-800',
  Rejected: 'bg-red-200 text-red-800',
}

const typeLabels = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  spare_parts:    'Venta Repuestos',
  sale:           'Venta',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const rubroLabels = {
  construccion: 'Construcción',
  mineria:      'Minería',
  transporte:   'Transporte',
  energia:      'Energía',
}

const CustomerDetailModal = ({ isOpen, handleClose, customer }) => {
  const { getModel } = useCrud('')
  const [quotations, setQuotations] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && customer) {
      const fetchHistory = async () => {
        setIsLoading(true)
        try {
          const response = await getModel(`/api/v1/admin/clients/${customer.id}`)
          if (response.quotations) {
            setQuotations(response.quotations)
          } else {
            setQuotations([])
          }
        } catch (error) {
          console.error("Error cargando el historial:", error)
          setQuotations([])
        } finally {
          setIsLoading(false)
        }
      }
      fetchHistory()
    } else {
      setQuotations([])
    }
  }, [isOpen, customer])

  if (!customer) return null

  const totalAmount   = quotations.filter(q => q.status === 'Approved' || q.status === 'client_accepted' || q.status === 'approved_internally').reduce((sum, q) => sum + parseFloat(q.amount || 0), 0)
  const totalApproved = quotations.filter(q => q.status === 'Approved' || q.status === 'client_accepted' || q.status === 'approved_internally').length

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {customer.business_name}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {customer.document_type}: {customer.document_number}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">

          {/* Datos generales */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Datos Generales
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Contacto',  value: customer.contact_name },
                { label: 'Teléfono', value: customer.phone },
                { label: 'Correo',   value: customer.email },
                { label: 'Rubro',    value: rubroLabels[customer.type] || customer.type },
                { label: 'Dirección', value: customer.address },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">{f.label}</span>
                  <span className="font-medium">{f.value || '—'}</span>
                </div>
              ))}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Estado</span>
                <Badge className={`w-fit px-2 py-0.5 text-xs ${customer.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                  {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Resumen
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FileTextIcon,    label: 'Total Cotizaciones', value: quotations.length },
                { icon: ShoppingCartIcon, label: 'Aprobadas',          value: totalApproved },
                { icon: DollarSignIcon,  label: 'Total Comprado',     value: `S/ ${totalAmount.toLocaleString()}` },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col gap-1 border rounded-lg p-3">
                  <stat.icon className="size-4 text-muted-foreground" />
                  <span className="text-xl font-bold">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historial cotizaciones */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Historial de Cotizaciones
            </p>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {['Código', 'Tipo', 'Ítem', 'Asesor', 'Monto', 'Fecha', 'Estado'].map(h => (
                      <th key={h} className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin size-4" />
                        Cargando historial...
                      </td>
                    </tr>
                  ) : quotations.length ? (
                    quotations.map((q, i) => (
                      <tr key={q.id} className={`border-t hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                        <td className="px-3 py-2 font-mono text-xs">{q.code}</td>
                        <td className="px-3 py-2">{typeLabels[q.quotation_type] || q.quotation_type}</td>
                        <td className="px-3 py-2">{q.item_description}</td>
                        <td className="px-3 py-2">{q.advisor}</td>
                        <td className="px-3 py-2">S/ {parseFloat(q.amount || 0).toLocaleString()}</td>
                        <td className="px-3 py-2">{q.date}</td>
                        <td className="px-3 py-2">
                          <Badge className={`px-2 py-0.5 text-xs ${statusColor[q.status] || 'bg-gray-200'}`}>
                            {q.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">
                        Sin cotizaciones registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CustomerDetailModal