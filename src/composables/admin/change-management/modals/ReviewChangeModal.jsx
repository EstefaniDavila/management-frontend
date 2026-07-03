import React, { useState } from 'react'
import Modal from '@/components/custom/modal'
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
        <div className="bg-muted/50 p-4 rounded-lg shadow-inner space-y-2 text-sm border">
          <p className="font-bold text-base mb-2 border-b pb-1">Información del Incidente</p>
          <div className="grid grid-cols-2 gap-2">
            <p><span className="text-muted-foreground font-semibold">Código:</span> {change.change_code || 'PENDIENTE'}</p>
            <p><span className="text-muted-foreground font-semibold">Módulo:</span> {change.module_affected || '-'}</p>
            <p><span className="text-muted-foreground font-semibold">Severidad:</span> {change.severity || '-'}</p>
          </div>
          <div className="mt-3 pt-3 border-t">
            <p className="text-muted-foreground font-semibold mb-2">Descripción y Análisis ITIL:</p>
            <div className="whitespace-pre-wrap font-mono text-xs bg-background p-3 rounded-md border shadow-sm">
              {change.description || change.title || '-'}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ReviewChangeModal