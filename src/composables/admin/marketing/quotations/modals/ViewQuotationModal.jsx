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
  Pending:  'bg-yellow-200 text-yellow-800',
  Approved: 'bg-green-200 text-green-800',
  Rejected: 'bg-red-200 text-red-800',
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

        <div className="flex flex-col gap-6 flex-1">

          {/* Stats rápidos */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: DollarSignIcon, label: 'Monto',  value: `S/ ${quotation.amount?.toLocaleString()}` },
              { icon: CalendarIcon,   label: 'Fecha',  value: quotation.date },
              { icon: UserIcon,       label: 'Asesor', value: quotation.advisor },
              { icon: FileTextIcon,   label: 'Equipo', value: quotation.equipment },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col gap-1 border rounded-lg p-3">
                <stat.icon className="size-4 text-muted-foreground" />
                <span className="text-sm font-semibold">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Datos del cliente — uno por fila */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Datos del Cliente
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Cliente',   value: quotation.customer },
                { label: 'RUC / DNI', value: quotation.document },
                { label: 'Asesor',    value: quotation.advisor   },
                { label: 'Equipo',    value: quotation.equipment },
                { label: 'Monto',     value: `S/ ${quotation.amount?.toLocaleString()}` },
                { label: 'Fecha',     value: quotation.date      },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-0.5 border-b pb-3 last:border-0 last:pb-0">
                  <span className="text-xs text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium">{f.value || '—'}</span>
                </div>
              ))}
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

export default ViewQuotationModal