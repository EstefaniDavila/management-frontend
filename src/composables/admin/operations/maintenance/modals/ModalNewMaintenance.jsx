import React, {useState} from 'react'
import Modal from '@/components/custom/modal'
import useEntityMutation from '@/hooks/useEntityMutation'
import { Input } from '@/components/ui/input'
import { handleChange } from '@/services/general/handlers'
import { MdForklift } from "react-icons/md";
import ComboBox from '@/components/custom/dan_combobox'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select"



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
  // const mutation = useEntityMutation({entityName: 'work-order'})

  const fakeTechnicians = [
    { label: "Juan Pérez", value: "juan-perez" },
    { label: "María García", value: "maria-garcia" },
    { label: "Carlos López", value: "carlos-lopez" },
    { label: "Ana Martínez", value: "ana-martinez" },
    { label: "Luis Rodríguez", value: "luis-rodriguez" },
  ];

  const handleSubmit = async() => {
    // mutation.mutate(
    //   { action: 'create', entity: formData, endpoint: 'api/v1/admin/categories'},
    //   handleClose(),
    // )}
    console.log("Mantenimiento solicitado", formData)
  }

  const onChangeExtra = (name, value) => {
  }

  return (
    <div>
      {isOpen && (
        <Modal
          open={isOpen}
          setOpen={handleClose}
          title="Procesar mantenimiento"
          description="Completa el formulario para asignar un tecnico y crear una orden de trabajo"
          size="lg"
          callBack={handleSubmit}
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-4">
                <div>
                  <label className='block text-sm font-medium py-2'>Tecnico a Cargo</label>
                  <ComboBox
                    options={fakeTechnicians}
                    placeholder="Elige un tecnico..."
                    onChange={(value) => handleChange({ target: { name: "technician", value } }, setFormData, onChangeExtra)}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium py-2'>Tipo de mantenimiento</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un tipo de mantenimiento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipo de mantenimeinto</SelectLabel>
                        <SelectItem value="solved">Mantenimiento Correctivo</SelectItem>
                        <SelectItem value="pieces">Mantenimiento Preventivo</SelectItem>
                        <SelectItem value="scaling">Mantenimiento Rutinario</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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