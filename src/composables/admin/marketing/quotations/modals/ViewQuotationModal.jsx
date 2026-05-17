import React from 'react'
import {
  SheetMultiStep,
  SheetMultiStepContent,
  SheetMultiStepHeader,
  SheetMultiStepTitle,
  SheetMultiStepDescription,
  SheetMultiStepFooter,
} from '@/components/custom/SheetMultiStep'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileTextIcon, DollarSignIcon, UserIcon, CalendarIcon } from 'lucide-react'

const statusColor = {
  Pending:      'bg-yellow-200 text-yellow-800',
  Approved:     'bg-green-200 text-green-800',
  Rejected:     'bg-red-200 text-red-800',
  draft:        'bg-gray-100 text-gray-700',
  sent:         'bg-blue-100 text-blue-800',
  web_request:  'bg-indigo-100 text-indigo-800',
  approved:     'bg-green-100 text-green-800',
  rejected:     'bg-red-100 text-red-800',
}

const ViewQuotationModal = ({ isOpen, handleClose, quotation }) => {
  if (!quotation) return null

  return (
    <SheetMultiStep open={isOpen} onOpenChange={handleClose}>
      <SheetMultiStepContent side="right" className="flex flex-col h-full">

        <SheetMultiStepHeader className="mb-6">
          <div className="flex items-center gap-2">
            <SheetMultiStepTitle>{quotation.code}</SheetMultiStepTitle>
            <Badge className={`px-2 py-0.5 text-xs ${statusColor[quotation.status]}`}>
              {quotation.status}
            </Badge>
          </div>
          <SheetMultiStepDescription>
            Detalle completo de la cotización
          </SheetMultiStepDescription>
        </SheetMultiStepHeader>

        <div className="flex flex-col gap-6 flex-1 overflow-y-auto pr-1">
 
          {/* Stats rápidos */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: DollarSignIcon, label: 'Monto Total',  value: `S/ ${parseFloat(quotation.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` },
              { icon: CalendarIcon,   label: 'Fecha',  value: quotation.date },
              { icon: UserIcon,       label: 'Asesor', value: quotation.advisor },
              { icon: FileTextIcon,   label: 'Equipo/Servicio', value: quotation.equipment },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col gap-1 border rounded-lg p-3 bg-card">
                <stat.icon className="size-4 text-muted-foreground" />
                <span className="text-sm font-semibold truncate">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
 
          {/* Datos del cliente — uno por fila */}
          <div className="border rounded-lg p-4 bg-muted/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Datos del Cliente
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Cliente',   value: quotation.customer },
                { label: 'RUC / DNI', value: quotation.document },
                { label: 'Asesor',    value: quotation.advisor   },
                { label: 'Fecha',     value: quotation.date      },
              ].map(f => (
                <div key={f.label} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0 text-xs">
                  <span className="text-muted-foreground font-medium">{f.label}</span>
                  <span className="font-semibold text-right max-w-[200px] truncate">{f.value || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Productos de la Cotización */}
          {quotation.items && quotation.items.length > 0 && (
            <div className="border rounded-lg p-4 bg-muted/10">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Productos / Servicios Solicitados
              </p>
              <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/80 text-muted-foreground text-xs uppercase font-medium">
                    <tr>
                      <th className="px-4 py-2">Producto</th>
                      <th className="px-4 py-2 text-center font-semibold">Cant.</th>
                      <th className="px-4 py-2 text-right font-semibold">Precio Unit.</th>
                      <th className="px-4 py-2 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {quotation.items.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium text-xs max-w-[150px] truncate">{item.description}</td>
                        <td className="px-4 py-2.5 text-center text-xs font-mono">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right text-xs font-mono">S/ {parseFloat(item.unit_price || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="px-4 py-2.5 text-right text-xs font-semibold text-blue-600 font-mono">S/ {parseFloat(item.total_price || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-muted/40 px-4 py-3 border-t flex flex-col gap-1.5 text-xs text-right">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Subtotal:</span>
                    <span className="font-mono font-medium">S/ {parseFloat(quotation.subtotal || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>IGV (18%):</span>
                    <span className="font-mono font-medium">S/ {parseFloat(quotation.tax || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold border-t pt-1.5 text-sm text-foreground">
                    <span>Total General:</span>
                    <span className="text-blue-600 font-mono">S/ {parseFloat(quotation.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notas Originales del Lead / Solicitud Web */}
          {quotation.lead_description && (
            <div className="border rounded-lg p-4 bg-indigo-50/50 border-indigo-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-800 mb-3">
                Requerimientos Originales del Cliente
              </p>
              <div className="text-sm text-indigo-900 whitespace-pre-line leading-relaxed">
                {quotation.lead_description}
              </div>
            </div>
          )}
 
        </div>

        <SheetMultiStepFooter className="mt-auto pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>Cerrar</Button>
        </SheetMultiStepFooter>

      </SheetMultiStepContent>
    </SheetMultiStep>
  )
}

export default ViewQuotationModal