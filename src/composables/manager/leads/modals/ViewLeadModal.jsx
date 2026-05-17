import React, { useState, useEffect } from 'react'
import {
  SheetMultiStep, SheetMultiStepContent, SheetMultiStepHeader,
  SheetMultiStepTitle, SheetMultiStepDescription, SheetMultiStepFooter,
} from '@/components/custom/SheetMultiStep'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BuildingIcon, UserIcon, MailIcon, PhoneIcon, CalendarIcon, TagIcon, Star } from 'lucide-react'
import { useAuth } from '@/providers/UserContext'
import axios from 'axios'

const typeLabel = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const statusColor = {
  pending:     'bg-yellow-100 text-yellow-800',
  new:         'bg-purple-100 text-purple-800',
  assigned:    'bg-blue-100 text-blue-800',
  in_progress: 'bg-orange-100 text-orange-800',
  converted:   'bg-green-100 text-green-800',
  lost:        'bg-gray-100 text-gray-800',
}

const statusLabel = {
  pending:     'Pendiente',
  new:         'Nuevo / Web',
  assigned:    'Asignado',
  in_progress: 'En Proceso',
  converted:   'Convertido',
  lost:        'Perdido',
}

const ViewLeadModal = ({ isOpen, handleClose, lead }) => {
  const { user } = useAuth()
  const [priority, setPriority] = useState('NC')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (lead) {
      setPriority(lead.priority || 'NC')
    }
  }, [lead])

  if (!lead) return null

  const handleSavePriority = async () => {
    setIsSaving(true)
    try {
      const backend_host = import.meta.env.VITE_BACKEND_HOST
      // Detect namespace based on manager vs advisor role/area
      const isManager = user?.role === 'manager' || user?.area
      const endpoint = isManager
        ? `/api/v1/manager/leads/${lead.id}`
        : `/api/v1/advisor/leads/${lead.id}`
      
      const payload = {
        lead: { priority }
      }
      
      await axios.put(`${backend_host}${endpoint}`, payload)
      alert('Clasificación guardada con éxito!')
      window.location.reload()
    } catch (error) {
      console.error(error)
      alert('Error al guardar la clasificación')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SheetMultiStep open={isOpen} onOpenChange={handleClose}>
      <SheetMultiStepContent side="right" className="flex flex-col h-full overflow-y-auto max-w-lg w-full sm:max-w-xl">

        <SheetMultiStepHeader className="mb-6">
          <div className="flex items-center gap-2">
            <SheetMultiStepTitle>{lead.company}</SheetMultiStepTitle>
            <Badge className={`px-2 py-0.5 text-xs font-semibold ${statusColor[lead.status] || 'bg-gray-100'}`}>
              {statusLabel[lead.status] || lead.status}
            </Badge>
          </div>
          <SheetMultiStepDescription>
            Detalle completo y gestión de la solicitud
          </SheetMultiStepDescription>
        </SheetMultiStepHeader>

        <div className="flex flex-col gap-6 flex-1 pb-8">

          {/* Stats rápidos */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: BuildingIcon,  label: 'Empresa',  value: lead.company },
              { icon: TagIcon,       label: 'Tipo',     value: typeLabel[lead.request_type] || lead.request_type },
              { icon: CalendarIcon,  label: 'Fecha',    value: lead.created_at },
              { icon: UserIcon,      label: 'Asesor',   value: lead.assigned_to || 'Sin asignar' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col gap-1 border rounded-lg p-3 bg-card shadow-sm">
                <stat.icon className="size-4 text-muted-foreground"/>
                <span className="text-sm font-semibold truncate">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Clasificación Comercial (CN, CP, CR) */}
          <div className="border rounded-lg p-4 bg-blue-50/50 border-blue-100 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-blue-800">
              <Star className="size-4 fill-blue-600 text-blue-600" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Clasificación Comercial
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full bg-white border-blue-200">
                  <SelectValue placeholder="Selecciona clasificación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NC">NC (Cliente Nuevo)</SelectItem>
                  <SelectItem value="CP">CP (Cliente Potencial)</SelectItem>
                  <SelectItem value="NN">CN (Cliente No Deseado)</SelectItem>
                  <SelectItem value="NH">CH (Cliente Histórico)</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleSavePriority} 
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Define si es un Cliente Potencial (CP), Reciclado (CR) o No Deseado (CN) para priorizar el seguimiento.
            </p>
          </div>

          {/* Productos de la Cotización */}
          {lead.quotation_items && lead.quotation_items.length > 0 && (
            <div className="border rounded-lg p-4 bg-muted/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Productos Solicitados (Cotización Web)
              </p>
              <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground text-xs uppercase font-medium">
                    <tr>
                      <th className="px-4 py-2">Producto</th>
                      <th className="px-4 py-2 text-center">Cant.</th>
                      <th className="px-4 py-2 text-right">Precio</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {lead.quotation_items.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium text-xs max-w-[150px] truncate">{item.description}</td>
                        <td className="px-4 py-2.5 text-center text-xs">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right text-xs">${item.unit_price.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right text-xs font-semibold">${item.total_price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-muted/40 px-4 py-2.5 text-right text-xs font-bold border-t flex justify-between items-center">
                  <span className="text-muted-foreground">Total Estimado:</span>
                  <span className="text-sm font-bold text-blue-600">
                    ${lead.quotation_items.reduce((sum, i) => sum + i.total_price, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

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
              {lead.description || 'Sin notas adicionales.'}
            </p>
          </div>

        </div>

        <SheetMultiStepFooter className="mt-auto pt-6 border-t bg-background">
          <Button variant="outline" onClick={handleClose}>Cerrar</Button>
        </SheetMultiStepFooter>

      </SheetMultiStepContent>
    </SheetMultiStep>
  )
}

export default ViewLeadModal