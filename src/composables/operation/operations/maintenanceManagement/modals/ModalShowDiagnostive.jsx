import React, {useState} from 'react'
import Modal from '@/components/custom/modal'
import useEntityMutation from '@/hooks/useEntityMutation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { handleChange } from '@/services/general/handlers'

const ModalShowDiagnostive = ({ isOpen, handleClose, workOrder }) =>{

  return (
    <div>
      {isOpen && (
        <Modal
          open={isOpen}
          setOpen={handleClose}
          title="Ver Diagnóstico"
          description="Información del diagnóstico seleccionado."
          size="md"
        >
          <form>
            <div>
              <label className='block text-sm font-medium py-2'>Resultados y Requerimientos</label>
              <Input
                value={workOrder?.diagnosis_result || ''}
                readOnly
              />
            </div>
            <div>
              <label className='block text-sm font-medium py-2'>Diagnostico detallado</label>
              <Textarea
                rows={5}
                value={workOrder?.diagnosis || ''}
                readOnly
              />
            </div>
            {/* <div>
              <label className='block text-sm font-medium py-2'>Imagen de evidencia</label>
              {workOrder?.evidence ? (
                <img
                  src={workOrder.evidence}
                  alt="Evidencia"
                  className="w-full object-cover rounded-md border"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay evidencia registrada
                </p>
              )}
            </div> */}
          </form>
        </Modal>
      )}
    </div>
  )
}

export default ModalShowDiagnostive