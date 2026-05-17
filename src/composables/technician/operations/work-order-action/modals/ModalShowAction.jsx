import React, {useState} from 'react'
import Modal from '@/components/custom/modal'
import useEntityMutation from '@/hooks/useEntityMutation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { handleChange } from '@/services/general/handlers'

const ModalShowAction = ({ isOpen, handleClose, workOrderAction }) =>{

  return (
    <div>
      {isOpen && (
        <Modal
          open={isOpen}
          setOpen={handleClose}
          title="Ver Acción"
          description="Información de la acción seleccionada."
          size="md"
        >
          <form>
            <div>
              <label className='block text-sm font-medium py-2'>Acción</label>
              <Input
                placeholder='Ej: Cambio de aceite'
                value={workOrderAction?.action || ''}
                readOnly
              />
            </div>
            <div>
              <label className='block text-sm font-medium py-2'>Descripción</label>
              <Textarea
                rows={5}
                placeholder='Describe la acción realizada...'
                value={workOrderAction?.description || ''}
                readOnly
              />
            </div>
            <div>
              <label className='block text-sm font-medium py-2'>Imagen de evidencia</label>
              {workOrderAction?.evidence ? (
                <img
                  src={workOrderAction.evidence}
                  alt="Evidencia"
                  className="w-full object-cover rounded-md border"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay evidencia registrada
                </p>
              )}
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default ModalShowAction