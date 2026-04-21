import React, { useState, useEffect } from 'react'
import {
  SheetMultiStep, SheetMultiStepContent, SheetMultiStepHeader,
  SheetMultiStepTitle, SheetMultiStepDescription, SheetMultiStepFooter,
} from '@/components/custom/SheetMultiStep'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const typeLabel = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const ConvertToQuotationModal = ({ isOpen, handleClose, lead, onCreate }) => {
  const [form, setForm] = useState({ equipment: '', amount: '', date: '', notes: '' })

  useEffect(() => {
    if (lead) setForm({ equipment: '', amount: '', date: '', notes: '' })
  }, [lead, isOpen])

  const handleSubmit = () => {
    const newQ = {
      code:           `AQ-${String(Date.now()).slice(-4)}`,
      lead_id:        lead.id,
      customer:       lead.company,
      email:          lead.email,
      equipment:      form.equipment,
      quotation_type: lead.request_type,
      advisor:        lead.assigned_to,
      amount:         Number(form.amount),
      date:           form.date,
      notes:          form.notes,
      status:         'draft',
    }
    onCreate(newQ)
    handleClose()
  }

  if (!lead) return null

  return (
    <SheetMultiStep open={isOpen} onOpenChange={handleClose}>
      <SheetMultiStepContent side="right" className="flex flex-col h-full">

        <SheetMultiStepHeader className="mb-6">
          <SheetMultiStepTitle>Nueva Cotización</SheetMultiStepTitle>
          <SheetMultiStepDescription>
            Basada en el lead de <strong>{lead.company}</strong>
          </SheetMultiStepDescription>
        </SheetMultiStepHeader>

        <div className="flex flex-col gap-6 flex-1">

          {/* Info del lead (solo lectura) */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Datos del Cliente
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Empresa',  value: lead.company },
                { label: 'Contacto', value: lead.name },
                { label: 'Correo',   value: lead.email },
                { label: 'Tipo',     value: typeLabel[lead.request_type] },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-0.5 border-b pb-2 last:border-0">
                  <span className="text-xs text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detalle cotización */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Detalle de la Cotización
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Equipo / Servicio</Label>
                <Input
                  placeholder="Ej: Excavadora CAT 320"
                  value={form.equipment}
                  onChange={e => setForm(p => ({ ...p, equipment: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Monto (S/)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Notas adicionales</Label>
                <Input
                  placeholder="Condiciones, plazos, etc."
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                />
              </div>
            </div>
          </div>

        </div>

        <SheetMultiStepFooter className="mt-auto pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar Cotización</Button>
        </SheetMultiStepFooter>

      </SheetMultiStepContent>
    </SheetMultiStep>
  )
}

export default ConvertToQuotationModal