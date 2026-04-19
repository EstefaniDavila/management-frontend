import React, {useState} from 'react'
import Modal from '@/components/custom/modal'
import useEntityMutation from '@/hooks/useEntityMutation'
import { Input } from '@/components/ui/input'
import { handleChange } from '@/services/general/handlers'
import { MdForklift } from "react-icons/md";


const ModalNewMaintenance = ({ isOpen, handleClose }) =>{
  const [formData, setFormData] = useState({
    code: "",
    equipment: "",
    maintenance_type: "",
    technician: "",
    status: "",
    date: "",
    client: ""
  })
  const mutation = useEntityMutation({entityName: 'category'})

  const handleSubmit = async() => {
    mutation.mutate(
      { action: 'create', entity: formData, endpoint: 'api/v1/admin/categories'},
      handleClose(),
    )
  }

  const onChangeExtra = (name, value) => {
  }

  return (
    <div>
      {isOpen && (
        <Modal
          open={isOpen}
          setOpen={handleClose}
          title="Solicitar Mantenimiento"
          description="Completa el formulario para solicitar un mantenimiento."
          size="lg"
          callBack={handleSubmit}
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-4">
                <div>
                  <label className='block text-sm font-medium py-2'>Equipo</label>
                  <Input
                    type="text"
                    name="equipment"
                    value={formData.equipment}
                    onChange={(e)=> handleChange(e, setFormData, onChangeExtra)}
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium py-2'>Tipo de mantenimiento</label>
                  <Input
                    type="text"
                    name="maintenance_type"
                    value={formData.maintenance_type}
                    onChange={(e)=> handleChange(e, setFormData, onChangeExtra)}
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium py-2'>Fecha</label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={(e)=> handleChange(e, setFormData, onChangeExtra)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <MdForklift className="text-[120px] opacity-70" />
              </div>

            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default ModalNewMaintenance