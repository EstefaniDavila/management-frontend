import React from 'react'
import {
  SheetMultiStep, SheetMultiStepContent, SheetMultiStepHeader,
  SheetMultiStepTitle, SheetMultiStepDescription, SheetMultiStepFooter,
} from '@/components/custom/SheetMultiStep'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BuildingIcon, UserIcon, MailIcon, PhoneIcon, CalendarIcon, TagIcon } from 'lucide-react'

const typeLabel = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const statusColor = {
  pending:   'bg-yellow-100 text-yellow-800',
  assigned:  'bg-blue-100 text-blue-800',
  converted: 'bg-green-100 text-green-800',
}

const statusLabel = {
  pending:   'Pendiente',
  assigned:  'Asignado',
  converted: 'Convertido',
}

const ViewLeadModal = ({ isOpen, handleClose, lead }) => {
  if (!lead) return null

  return (
    <SheetMultiStep open={isOpen} onOpenChange={handleClose}>
      <SheetMultiStepContent side="right" className="flex flex-col h-full">

        <SheetMultiStepHeader className="mb-6">
          <div className="flex items-center gap-2">
            <SheetMultiStepTitle>{lead.company}</SheetMultiStepTitle>
            <Badge className={`px-2 py-0.5 text-xs ${statusColor[lead.status]}`}>
              {statusLabel[lead.status]}
            </Badge>
          </div>
          <SheetMultiStepDescription>
            Detalle completo del lead
          </SheetMultiStepDescription>
        </SheetMultiStepHeader>

        <div className="flex flex-col gap-6 flex-1">

          {/* Stats rápidos */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: BuildingIcon,  label: 'Empresa',  value: lead.company },
              { icon: TagIcon,       label: 'Tipo',     value: typeLabel[lead.request_type] || lead.request_type },
              { icon: CalendarIcon,  label: 'Fecha',    value: lead.created_at },
              { icon: UserIcon,      label: 'Asesor',   value: lead.assigned_to || 'Sin asignar' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col gap-1 border rounded-lg p-3">
                <stat.icon className="size-4 text-muted-foreground"/>
                <span className="text-sm font-semibold">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Datos de contacto */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Datos de Contacto
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Nombre',    value: lead.name,  icon: UserIcon  },
                { label: 'Correo',    value: lead.email, icon: MailIcon  },
                { label: 'Teléfono', value: lead.phone, icon: PhoneIcon },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-0.5 border-b pb-3 last:border-0 last:pb-0">
                  <span className="text-xs text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium">{f.value || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Descripción de la Solicitud
            </p>
            <p className="text-sm leading-relaxed border rounded-lg p-4 bg-muted/30">
              {lead.description}
            </p>
          </div>

        </div>

        <SheetMultiStepFooter className="mt-auto pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>Cerrar</Button>
        </SheetMultiStepFooter>

      </SheetMultiStepContent>
    </SheetMultiStep>
  )
}

export default ViewLeadModal