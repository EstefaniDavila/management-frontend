import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileTextIcon, ShoppingCartIcon, DollarSignIcon } from 'lucide-react'

const statusColor = {
  Pending:  'bg-yellow-200 text-yellow-800',
  Approved: 'bg-green-200 text-green-800',
  Rejected: 'bg-red-200 text-red-800',
}

const typeLabels = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const rubroLabels = {
  construccion: 'Construcción',
  mineria:      'Minería',
  transporte:   'Transporte',
  energia:      'Energía',
}

const fakeQuotationsByCustomer = {
  1: [
    { id: 1, code: 'QT-001', quotation_type: 'machinery_sale', item_description: 'Excavadora CAT 320',             advisor: 'Juan Pérez',     amount: 185000, date: '2026-04-15', status: 'Approved' },
    { id: 2, code: 'QT-004', quotation_type: 'parts_sale',     item_description: 'Kit junta motor x5',             advisor: 'Juan Pérez',     amount: 12000,  date: '2026-04-18', status: 'Pending'  },
  ],
  2: [
    { id: 3, code: 'QT-002', quotation_type: 'machinery_sale', item_description: 'Cargador Frontal Komatsu WA380', advisor: 'Carlos Ramírez', amount: 260000, date: '2026-04-16', status: 'Approved' },
    { id: 4, code: 'QT-005', quotation_type: 'rental',         item_description: 'Alquiler Volquete Volvo FMX',    advisor: 'Carlos Ramírez', amount: 8000,   date: '2026-04-19', status: 'Rejected' },
  ],
}

const CustomerDetailModal = ({ isOpen, handleClose, customer }) => {
  if (!customer) return null

  const quotations    = fakeQuotationsByCustomer[customer.id] || []
  const totalAmount   = quotations.filter(q => q.status === 'Approved').reduce((sum, q) => sum + q.amount, 0)
  const totalApproved = quotations.filter(q => q.status === 'Approved').length

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
                  {quotations.length ? quotations.map((q, i) => (
                    <tr key={q.id} className={`border-t hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-3 py-2 font-mono text-xs">{q.code}</td>
                      <td className="px-3 py-2">{typeLabels[q.quotation_type]}</td>
                      <td className="px-3 py-2">{q.item_description}</td>
                      <td className="px-3 py-2">{q.advisor}</td>
                      <td className="px-3 py-2">S/ {q.amount.toLocaleString()}</td>
                      <td className="px-3 py-2">{q.date}</td>
                      <td className="px-3 py-2">
                        <Badge className={`px-2 py-0.5 text-xs ${statusColor[q.status]}`}>
                          {q.status}
                        </Badge>
                      </td>
                    </tr>
                  )) : (
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