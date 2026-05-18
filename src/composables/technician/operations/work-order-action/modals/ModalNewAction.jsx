import React, {useState} from 'react'
import Modal from '@/components/custom/modal'
import useEntityMutation from '@/hooks/useEntityMutation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { handleChange } from '@/services/general/handlers'

const ModalNewAction = ({ isOpen, handleClose, workOrder, user }) =>{
  const [formData] = useState(new FormData())
  const mutation = useEntityMutation({entityName: 'work_order_action'})
  const handleChange = (key, value) => {
    formData.set(key, value)
  }

  const handleSubmit = async () => {
    formData.set("evidence", "")
    formData.set("performed_by_id", user?.roleable?.id || "")
    formData.set("work_order_id", workOrder?.id || "")
    await mutation.mutateAsync({
      action: 'create', entity: formData, endpoint: '/api/v1/manager/work_order_actions'
    })
    handleClose()
  }

  return (
    <div>
      {isOpen && (
        <Modal
          open={isOpen}
          setOpen={handleClose}
          title="Crear Acción"
          description="Completa el formulario para crear una nueva acción."
          size="md"
          callBack={handleSubmit}
        >
          <form onSubmit={handleSubmit}>
            <div>
              <label className='block text-sm font-medium py-2'>Acción</label>
              <Input
                placeholder='Ej: Cambio de aceite'
                onChange={(e) => handleChange("action", e.target.value) }
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium py-2'>Descripción</label>
              <Textarea
                rows={5}
                placeholder='Describe la acción realizada...'
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium py-2'>Imagen de evidencia</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleChange("cover", e.target.files[0])
                }}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default ModalNewAction