import React, { useState, useEffect } from 'react'
import {
  SheetMultiStep, SheetMultiStepContent, SheetMultiStepHeader,
  SheetMultiStepTitle, SheetMultiStepDescription, SheetMultiStepFooter,
} from '@/components/custom/SheetMultiStep'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

import useCrud from '@/hooks/useCrud'

const typeLabel = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const AssignLeadModal = ({ isOpen, handleClose, lead, onAssign }) => {
  const { getModel: getAdvisors } = useCrud('/api/v1/manager/advisors')
  const [advisors, setAdvisors] = useState([])
  const [selectedAdvisorId, setSelectedAdvisorId] = useState('')

  useEffect(() => {
    if (isOpen) {
      getAdvisors()
        .then(data => {
          setAdvisors(data.advisors || [])
        })
        .catch(err => console.error("Error fetching advisors:", err))

      // preselect currently assigned advisor ID
      setSelectedAdvisorId(lead?._original?.assigned_to_id || '')
    }
  }, [lead, isOpen])

  const handleSubmit = () => {
    if (!selectedAdvisorId) return
    onAssign(lead.id, selectedAdvisorId)
    handleClose()
  }

  if (!lead) return null

  return (
    <SheetMultiStep open={isOpen} onOpenChange={handleClose}>
      <SheetMultiStepContent side="right" className="flex flex-col h-full">

        <SheetMultiStepHeader className="mb-6">
          <SheetMultiStepTitle>Asignar Lead</SheetMultiStepTitle>
          <SheetMultiStepDescription>
            Asigna este lead a un asesor del equipo comercial
          </SheetMultiStepDescription>
        </SheetMultiStepHeader>

        <div className="flex flex-col gap-6 flex-1">

          {/* Info del lead */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Detalle del Lead
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Empresa',      value: lead.company },
                { label: 'Contacto',     value: lead.name },
                { label: 'Correo',       value: lead.email },
                { label: 'Teléfono',     value: lead.phone },
                { label: 'Tipo',         value: typeLabel[lead.request_type] || lead.request_type },
                { label: 'Fecha',        value: lead.created_at },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-0.5 border-b pb-2 last:border-0 last:pb-0">
                  <span className="text-xs text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium">{f.value || '—'}</span>
                </div>
              ))}

              {/* Descripción aparte porque puede ser larga */}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Descripción</span>
                <p className="text-sm leading-relaxed border rounded-lg p-3 bg-muted/30 whitespace-pre-line">
                  {lead.description}
                </p>
              </div>
            </div>
          </div>

          {/* Selector de asesor */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Asignación
            </p>
            <div className="flex flex-col gap-1.5">
              <Label>Asesor responsable</Label>
              <Select value={selectedAdvisorId} onValueChange={setSelectedAdvisorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un asesor" />
                </SelectTrigger>
                <SelectContent>
                  {advisors.map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {lead.assigned_to && (
                <p className="text-xs text-muted-foreground">
                  Actualmente asignado a: <span className="font-medium">{lead.assigned_to}</span>
                </p>
              )}
            </div>
          </div>

        </div>

        <SheetMultiStepFooter className="mt-auto pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!selectedAdvisorId}>
            Confirmar Asignación
          </Button>
        </SheetMultiStepFooter>

      </SheetMultiStepContent>
    </SheetMultiStep>
  )
}

export default AssignLeadModal