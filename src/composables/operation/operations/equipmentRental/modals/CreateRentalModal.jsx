import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon, CheckCircle2 } from "lucide-react"

export default function CreateRentalModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    customer: '',
    equipment: '',
    deliveryDate: '',
    notes: ''
  })

  // Simulated inventory check
  const availableEquipment = [
    { id: 'CAT-320-01', name: 'Excavadora CAT 320 (CAT-001)', status: 'Disponible' },
    { id: 'VOL-A40-02', name: 'Volquete Volvo A40 (VOL-002)', status: 'Disponible' },
    { id: 'KOM-WA-05', name: 'Cargador Frontal Komatsu WA380 (KOM-005)', status: 'Disponible' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: `REN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      status: 'Pendiente',
      ...formData
    })
    setFormData({ customer: '', equipment: '', deliveryDate: '', notes: '' })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Renta de Equipo</DialogTitle>
          <DialogDescription>
            Verifica la disponibilidad y asigna la fecha de entrega para el cliente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          
          <div className="space-y-2">
            <Label htmlFor="customer">Cliente / Empresa</Label>
            <Input 
              id="customer" 
              placeholder="Ej. Constructora Andina SAC" 
              required
              value={formData.customer}
              onChange={(e) => setFormData({...formData, customer: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment">Equipo Disponible</Label>
            <Select 
              required 
              value={formData.equipment} 
              onValueChange={(val) => setFormData({...formData, equipment: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una máquina del inventario" />
              </SelectTrigger>
              <SelectContent>
                {availableEquipment.map(eq => (
                  <SelectItem key={eq.id} value={eq.name}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      {eq.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Sólo se muestran equipos verificados y listos para operar.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Fecha y Hora de Entrega</Label>
            <div className="relative">
              <Input 
                id="deliveryDate" 
                type="datetime-local" 
                required
                value={formData.deliveryDate}
                onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas Operativas Adicionales</Label>
            <Input 
              id="notes" 
              placeholder="Ej. Entregar con tanque lleno y operador" 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Generar Renta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
