import React, { useState, useEffect } from 'react'
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

const emptyForm = {
  code: '', customer: '', document: '', order_type: '',
  item_description: '', advisor: '', amount: '', date: '',
}

const CreateSalesOrderModal = ({ isOpen, handleClose, onSave, initialData }) => {
  const [form, setForm] = useState(emptyForm)
  const isEditing = !!initialData

  useEffect(() => {
    setForm(initialData ? { ...initialData } : emptyForm)
  }, [initialData, isOpen])

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = () => {
    onSave(form)
    handleClose()
  }

  return (
    <SheetMultiStep open={isOpen} onOpenChange={handleClose}>
      <SheetMultiStepContent side="right" className="flex flex-col h-full">

        <SheetMultiStepHeader className="mb-6">
          <SheetMultiStepTitle>
            {isEditing ? `Actualizar Orden ${initialData?.code}` : 'Nueva Orden de Venta'}
          </SheetMultiStepTitle>
          <SheetMultiStepDescription>
            {isEditing
              ? 'Actualiza el estado de la orden de venta.'
              : 'Completa los campos para registrar una nueva orden.'}
          </SheetMultiStepDescription>
        </SheetMultiStepHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
          {isEditing ? (
            // ── Modo edición: solo estado ──
            <>
              <div className="flex flex-col gap-2 border rounded-lg p-3 bg-muted/30">
                <span className="text-xs text-muted-foreground">Código</span>
                <span className="text-sm font-medium">{form.code}</span>
              </div>
              <div className="flex flex-col gap-2 border rounded-lg p-3 bg-muted/30">
                <span className="text-xs text-muted-foreground">Cliente</span>
                <span className="text-sm font-medium">{form.customer}</span>
              </div>
              <div className="flex flex-col gap-2 border rounded-lg p-3 bg-muted/30">
                <span className="text-xs text-muted-foreground">Ítem</span>
                <span className="text-sm font-medium">{form.item_description}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Estado *</Label>
                <Select value={form.status} onValueChange={v => handleChange('status', v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Generated">Generated</SelectItem>
                    <SelectItem value="Dispatched">Dispatched</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            // ── Modo creación: todos los campos ──
            <>
              <div className="flex flex-col gap-1.5">
                <Label>Código</Label>
                <Input placeholder="SO-001" value={form.code}
                  onChange={e => handleChange('code', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Cliente</Label>
                <Input placeholder="Razón social" value={form.customer}
                  onChange={e => handleChange('customer', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>RUC / DNI</Label>
                <Input placeholder="20601234567" value={form.document}
                  onChange={e => handleChange('document', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Tipo de Orden</Label>
                <Select value={form.order_type} onValueChange={v => handleChange('order_type', v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="machinery_sale">Venta Maquinaria</SelectItem>
                    <SelectItem value="parts_sale">Venta Repuestos</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    <SelectItem value="rental">Alquiler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Descripción del Ítem</Label>
                <Input placeholder="Ej: Excavadora CAT 320" value={form.item_description}
                  onChange={e => handleChange('item_description', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Asesor</Label>
                <Input placeholder="Nombre del asesor" value={form.advisor}
                  onChange={e => handleChange('advisor', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Monto (S/)</Label>
                <Input type="number" placeholder="0.00" value={form.amount}
                  onChange={e => handleChange('amount', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Fecha</Label>
                <Input type="date" value={form.date}
                  onChange={e => handleChange('date', e.target.value)} />
              </div>
            </>
          )}
        </div>

        <SheetMultiStepFooter className="mt-auto pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Actualizar Estado' : 'Guardar Orden'}
          </Button>
        </SheetMultiStepFooter>

      </SheetMultiStepContent>
    </SheetMultiStep>
  )
}

export default CreateSalesOrderModal