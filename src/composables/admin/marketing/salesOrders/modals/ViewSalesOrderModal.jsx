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
import { FileTextIcon, DollarSignIcon, UserIcon, CalendarIcon, PackageIcon } from 'lucide-react'

const statusColor = {
  Generated:  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Dispatched: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Delivered:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
}

const typeLabels = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const ViewSalesOrderModal = ({ isOpen, handleClose, order }) => {
  if (!order) return null

  return (
    <SheetMultiStep open={isOpen} onOpenChange={handleClose}>
      <SheetMultiStepContent side="right" className="flex flex-col h-full">

        <SheetMultiStepHeader className="mb-6">
          <div className="flex items-center gap-2">
            <SheetMultiStepTitle>{order.code}</SheetMultiStepTitle>
            <Badge className={`px-2 py-0.5 text-xs ${statusColor[order.status]}`}>
              {order.status}
            </Badge>
          </div>
          <SheetMultiStepDescription>
            Detalle completo de la orden de venta
          </SheetMultiStepDescription>
        </SheetMultiStepHeader>

        <div className="flex flex-col gap-6 flex-1">

          {/* Stats rápidos */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: DollarSignIcon, label: 'Monto',  value: `S/ ${order.amount?.toLocaleString()}` },
              { icon: CalendarIcon,   label: 'Fecha',  value: order.date },
              { icon: UserIcon,       label: 'Asesor', value: order.advisor },
              { icon: PackageIcon,    label: 'Tipo',   value: typeLabels[order.order_type] || order.order_type },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col gap-1 border rounded-lg p-3">
                <stat.icon className="size-4 text-muted-foreground" />
                <span className="text-sm font-semibold">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Datos de la orden */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Información de la Orden
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Cliente',      value: order.customer },
                { label: 'RUC / DNI',    value: order.document },
                { label: 'Asesor',       value: order.advisor },
                { label: 'Monto',        value: `S/ ${order.amount?.toLocaleString()}` },
                { label: 'Fecha',        value: order.date },
                { label: 'Cotización origen', value: order.quotation_code || '—' },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-0.5 border-b pb-3 last:border-0 last:pb-0">
                  <span className="text-xs text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium">{f.value || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ítems / Productos */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Ítems / Productos Adquiridos
            </p>
            <div className="flex flex-col gap-2 border rounded-lg p-3 bg-muted/30">
              {order.items && order.items.length > 0 ? (
                order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.description}</span>
                      <span className="text-xs text-muted-foreground">Cant: {item.quantity}</span>
                    </div>
                    <span className="text-sm font-semibold">S/ {item.total_price}</span>
                  </div>
                ))
              ) : (
                <span className="text-sm font-medium">{order.item_description || 'Sin ítems detallados'}</span>
              )}
            </div>
          </div>

        </div>

        <SheetMultiStepFooter className="mt-auto pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>Cerrar</Button>
        </SheetMultiStepFooter>

      </SheetMultiStepContent>
    </SheetMultiStep>
  )
}

export default ViewSalesOrderModal