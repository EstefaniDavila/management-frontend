import React, {useState} from 'react'
import Modal from '@/components/custom/modal'
import useEntityMutation from '@/hooks/useEntityMutation'
import { Input } from '@/components/ui/input'
import { handleChange } from '@/services/general/handlers'
import useFetchTechnicians from '../hooks/useFetchTechnicians'
import ComboBox from '@/components/custom/dan_combobox'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select"



const ModalNewWorkOrder = ({ isOpen, handleClose, maintenance_id }) =>{
  const [formData, setFormData] = useState({
    diagnosis: "",
    diagnosis_result: "",
    work_order_type: "DIAGNOSTIVE",
    status: "OPEN",
    scheduled_date: "",
    closed_date: "",
    maintenance_id: maintenance_id || "",
    assigned_to_id: ""
  })
  const mutation = useEntityMutation({entityName: 'work_order'})

  const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 10})
  const [search, setSearch] = useState("")
  const [searchFields, setSearchFields] = useState([""])
  const searchParams = {search, fields: searchFields.join(',') }
  const { data: techniciansData } = useFetchTechnicians(pagination, searchParams)

  const handleSubmit = async() => {
    mutation.mutate(
      { action: 'create', entity: formData, endpoint: '/api/v1/manager/work_orders'},
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
          title="Crear Orden de Trabajo"
          description="Completa el formulario para crear una nueva orden de trabajo."
          size="md"
          callBack={handleSubmit}
        >
          <form onSubmit={handleSubmit}>
            <div>
              <label className='block text-sm font-medium py-2'>Tipo de Orden de Trabajo</label>
              <Select
                value={formData.work_order_type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    work_order_type: value
                  })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un tipo de mantenimiento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipo de orden de trabajo</SelectLabel>
                    <SelectItem value="DIAGNOSTIVE">Orden de Trabajo de Diagnóstico</SelectItem>
                    <SelectItem value="EXECUTION">Orden de Trabajo de Ejecución</SelectItem>
                    <SelectItem value="SUPERVISION">Orden de Trabajo de Supervisión</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='block text-sm font-medium py-2'>Tipo de Orden de Trabajo</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value
                  })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un tipo de mantenimiento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Estado de orden de trabajo</SelectLabel>
                    <SelectItem value="OPEN">Abierta</SelectItem>
                    <SelectItem value="IN_PROGRESS">En Proceso</SelectItem>
                    <SelectItem value="CLOSED">Cerrada</SelectItem>
                    <SelectItem value="DRAFT">Borrador</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='block text-sm font-medium py-2'>Fecha de Ejecución</label>
              <Input
                type="datetime-local"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={(e)=> handleChange(e, setFormData, onChangeExtra)}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium py-2'>Tecnico Asignado</label>
              <ComboBox
                options={techniciansData?.rows}
                placeholder="Elige un tecnico..."
                onChange={(option) => handleChange({ target: { name: "assigned_to_id", value: option.value } }, setFormData, onChangeExtra)}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default ModalNewWorkOrder