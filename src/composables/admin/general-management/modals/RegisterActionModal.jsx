import React, { useState } from 'react'
import {
  SheetMultiStep,
  SheetMultiStepContent,
  SheetMultiStepHeader,
  SheetMultiStepTitle,
  SheetMultiStepDescription,
  SheetMultiStepFooter,
} from '@/components/custom/SheetMultiStep'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const initialForm = { area: '', action: '', responsible: '', date: '' }

const RegisterActionModal = ({ isOpen, handleClose, onSave }) => {
  const [form, setForm] = useState(initialForm)

  const handleSubmit = () => {
    onSave(form)
    setForm(initialForm)
    handleClose()
  }

  return (
    <SheetMultiStep open={isOpen} onOpenChange={handleClose}>
      <SheetMultiStepContent side="right" className="flex flex-col h-full">

        <SheetMultiStepHeader className="mb-6">
          <SheetMultiStepTitle>Registrar Acción Correctiva</SheetMultiStepTitle>
          <SheetMultiStepDescription>
            Documenta la acción a tomar para resolver el incumplimiento.
          </SheetMultiStepDescription>
        </SheetMultiStepHeader>

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-1.5">
            <Label>Área</Label>
            <Select value={form.area} onValueChange={v => setForm(p => ({ ...p, area: v }))}>
              <SelectTrigger><SelectValue placeholder="Seleccionar área" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Marketing & Sales">Marketing & Sales</SelectItem>
                <SelectItem value="Logística & Almacén">Logística & Almacén</SelectItem>
                <SelectItem value="Producción & Operaciones">Producción & Operaciones</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Acción correctiva</Label>
            <Input
              placeholder="Describe la acción a tomar"
              value={form.action}
              onChange={e => setForm(p => ({ ...p, action: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Responsable</Label>
            <Input
              placeholder="Nombre del responsable"
              value={form.responsible}
              onChange={e => setForm(p => ({ ...p, responsible: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Fecha límite</Label>
            <Input
              type="date"
              value={form.date}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
            />
          </div>
        </div>

        <SheetMultiStepFooter className="mt-auto pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar Acción</Button>
        </SheetMultiStepFooter>

      </SheetMultiStepContent>
    </SheetMultiStep>
  )
}

export default RegisterActionModal