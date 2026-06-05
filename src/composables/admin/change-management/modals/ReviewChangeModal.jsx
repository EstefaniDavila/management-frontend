import React, { useState } from 'react'
import Modal from '@/components/custom/Modal'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/custom/button'

const ReviewChangeModal = ({ open, setOpen, change, onAccept, onReject, loading }) => {
  const [action, setAction] = useState('accept')
  const [changeType, setChangeType] = useState('standard')
  const [adminNotes, setAdminNotes] = useState('')

  const resetForm = () => {
    setAction('accept')
    setChangeType('standard')
    setAdminNotes('')
  }

  const handleSubmit = async () => {
    if (action === 'accept') {
      await onAccept(changeType, adminNotes)
    } else {
      await onReject(adminNotes)
    }
    resetForm()
  }

  if (!change) return null

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      size="md"
      title="Revisar Cambio"
      description={`Revisando: ${change.title || change.change_code || 'Sin título'}`}
      callBack={handleSubmit}
    >
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Decisión</Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={action === 'accept' ? 'default' : 'outline'}
              onClick={() => setAction('accept')}
              className="flex-1"
              disabled={loading}
            >
              Aceptar
            </Button>
            <Button
              type="button"
              variant={action === 'reject' ? 'destructive' : 'outline'}
              onClick={() => setAction('reject')}
              className="flex-1"
              disabled={loading}
            >
              Rechazar
            </Button>
          </div>
        </div>

        {action === 'accept' && (
          <div className="space-y-2">
            <Label>Tipo de Cambio</Label>
            <Select value={changeType} onValueChange={setChangeType} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emergency">Emergencia</SelectItem>
                <SelectItem value="standard">Estándar</SelectItem>
                <SelectItem value="minor">Menor</SelectItem>
                <SelectItem value="major">Mayor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <Label>Notas del Administrador {action === 'reject' && '*'}</Label>
          <Textarea
            placeholder={action === 'accept' 
              ? "Ej: Se requiere con urgencia, asignar a equipo de backend..."
              : "Especificar motivo del rechazo..."
            }
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={4}
            disabled={loading}
          />
        </div>
        <div className="bg-muted/50 p-3 rounded-md space-y-1 text-sm">
          <p className="font-semibold mb-2">Información del cambio:</p>
          <p><span className="text-muted-foreground">Código:</span> {change.change_code || 'PENDIENTE'}</p>
          <p><span className="text-muted-foreground">Módulo:</span> {change.module_affected || '-'}</p>
          <p><span className="text-muted-foreground">Severidad:</span> {change.severity || '-'}</p>
          <p><span className="text-muted-foreground">Descripción:</span> {change.description || change.title || '-'}</p>
        </div>
      </div>
    </Modal>
  )
}

export default ReviewChangeModal