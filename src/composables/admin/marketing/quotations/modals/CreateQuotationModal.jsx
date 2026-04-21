import React, { useState } from 'react'
import {
  SheetMultiStep, SheetMultiStepContent, SheetMultiStepHeader,
  SheetMultiStepTitle, SheetMultiStepDescription, SheetMultiStepFooter,
} from '@/components/custom/SheetMultiStep'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select'
import { handleChange, handleSelectChange } from '@/services/general/handlers'

const initialForm = {
  code: '', customer: '', document: '', equipment: '',
  advisor: '', amount: '', date: '', quotation_type: ''
}

const CreateQuotationModal = ({ isOpen, handleClose, onCreate }) => {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors]     = useState({})
  const onChangeExtra = () => {}

  const validate = () => {
    const e = {}
    if (!formData.customer)        e.customer        = 'Cliente obligatorio'
    if (!formData.document)        e.document        = 'Documento obligatorio'
    if (!formData.equipment)       e.equipment       = 'Equipo obligatorio'
    if (!formData.quotation_type)  e.quotation_type  = 'Tipo obligatorio'
    if (!formData.amount || formData.amount <= 0) e.amount = 'Monto debe ser mayor a 0'
    if (!formData.date)            e.date            = 'Fecha obligatoria'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onCreate({ ...formData, status: 'Pending', id: Date.now() })
    setFormData(initialForm)
    setErrors({})
    handleClose()
  }

  return (
    <SheetMultiStep open={isOpen} onOpenChange={handleClose}>
      <SheetMultiStepContent side="right" className="flex flex-col h-full">
        <SheetMultiStepHeader className="mb-6">
          <SheetMultiStepTitle>Nueva Cotización</SheetMultiStepTitle>
          <SheetMultiStepDescription>
            Completa los campos para registrar una nueva cotización.
          </SheetMultiStepDescription>
        </SheetMultiStepHeader>

        <div className="flex flex-col gap-6 flex-1 overflow-y-auto">

          {/* Datos del Cliente */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Datos del Cliente
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Cliente *</Label>
                <Input name="customer" placeholder="Razón social"
                  value={formData.customer}
                  onChange={e => handleChange(e, setFormData, onChangeExtra)} />
                {errors.customer && <span className="text-xs text-red-500">{errors.customer}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>RUC / DNI *</Label>
                <Input name="document" placeholder="20601234567"
                  value={formData.document}
                  onChange={e => handleChange(e, setFormData, onChangeExtra)} />
                {errors.document && <span className="text-xs text-red-500">{errors.document}</span>}
              </div>
            </div>
          </div>

          {/* Detalle */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Detalle de Cotización
            </p>
            <div className="flex flex-col gap-3">

              <div className="flex flex-col gap-1.5">
                <Label>Código</Label>
                <Input name="code" placeholder="QT-005"
                  value={formData.code}
                  onChange={e => handleChange(e, setFormData, onChangeExtra)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Tipo de Cotización *</Label>
                <Select
                  value={formData.quotation_type}
                  onValueChange={v => handleSelectChange('quotation_type', v, setFormData, onChangeExtra)}
                >
                  <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="machinery_sale">Venta Maquinaria</SelectItem>
                    <SelectItem value="parts_sale">Venta Repuestos</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    <SelectItem value="rental">Alquiler</SelectItem>
                  </SelectContent>
                </Select>
                {errors.quotation_type && <span className="text-xs text-red-500">{errors.quotation_type}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Asesor</Label>
                <Input name="advisor" placeholder="Nombre del asesor"
                  value={formData.advisor}
                  onChange={e => handleChange(e, setFormData, onChangeExtra)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Equipo / Ítem *</Label>
                <Input name="equipment" placeholder="Ej: Excavadora CAT 320"
                  value={formData.equipment}
                  onChange={e => handleChange(e, setFormData, onChangeExtra)} />
                {errors.equipment && <span className="text-xs text-red-500">{errors.equipment}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Monto (S/) *</Label>
                <Input type="number" name="amount" placeholder="0.00"
                  value={formData.amount}
                  onChange={e => handleChange(e, setFormData, onChangeExtra)} />
                {errors.amount && <span className="text-xs text-red-500">{errors.amount}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Fecha *</Label>
                <Input type="date" name="date"
                  value={formData.date}
                  onChange={e => handleChange(e, setFormData, onChangeExtra)} />
                {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
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

export default CreateQuotationModal