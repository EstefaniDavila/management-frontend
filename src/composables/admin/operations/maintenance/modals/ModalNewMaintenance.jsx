import React, {useState} from 'react'
import Modal from '@/components/custom/modal'
import useEntityMutation from '@/hooks/useEntityMutation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { handleChange } from '@/services/general/handlers'
import { MdForklift } from "react-icons/md";
import ComboBox from '@/components/custom/dan_combobox'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select"
import useFetchClients from '@/composables/operation/operations/maintenanceManagement/hooks/useFetchClients'


const ModalNewMaintenance = ({ isOpen, handleClose }) =>{
  const [formData, setFormData] = useState({
    description: "",
    maintenance_type: "",
    prority: "HIGH",
    status: "PENDING",
    requested_at: "",
    scheduled_at: "",
    completed_at: "",
    client_id: "",
    customer_asset_id: "",
    enterprise_vehicle_id: "",
    quotation_id: ""
  })
  const mutation = useEntityMutation({entityName: "maintenance"})

  const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 10})
  const [search, setSearch] = useState("")
  const [searchFields, setSearchFields] = useState([""])
  const searchParams = {search, fields: searchFields.join(',') }
  const { data: clientsData } = useFetchClients(pagination, searchParams)
  const clientsOptions = clientsData?.rows?.map((client) => ({
    value: client.id,
    label: client.business_name
  })) || []

  const handleSubmit = async() => {
    mutation.mutate(
      { action: 'create', entity: formData, endpoint: '/api/v1/manager/maintenances' },
      handleClose(),
    )
  }
  const handlePrint = () => {
    console.log("Mantenimiento Ah subir", formData)
  }

  const onChangeExtra = (name, value) => {
  }

  return (
    <div>
      {isOpen && (
        <Modal
          open={isOpen}
          setOpen={handleClose}
          title="Crear mantenimiento"
          description="Completa el formulario para crear un nuevo mantenimiento"
          size="lg"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-4">
                <div>
                  <label className='block text-sm font-medium py-2'>Descripción del Mantenimiento</label>
                  <Input
                    type="text"
                    name="description" 
                    value={formData.description}
                    onChange={(e)=> handleChange(e, setFormData, onChangeExtra)}
                    placeholder="Describe el mantenimiento requerido..."
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium py-2'>Tipo de mantenimiento</label>
                  <Select
                    value={formData.maintenance_type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        maintenance_type: value
                      })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un tipo de mantenimiento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipo de mantenimeinto</SelectLabel>
                        <SelectItem value="CORRECTIVE">Mantenimiento Correctivo</SelectItem>
                        <SelectItem value="PREVENTIVE">Mantenimiento Preventivo</SelectItem>
                        <SelectItem value="RUTINARIE">Mantenimiento Rutinario</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <MdForklift className="text-[120px] opacity-70" />
              </div>
            </div>

            {/*     SEGUNDA SECCION     */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className='block text-sm font-medium py-2'>Prioridad</label>
                  <Select value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        priority: value
                      })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un nivel de prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipo de Prioridad</SelectLabel>
                        <SelectItem value="HIGH">ALTA</SelectItem>
                        <SelectItem value="MEDIUM">MEDIA</SelectItem>
                        <SelectItem value="LOW">BAJA</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className='block text-sm font-medium py-2'>Cliente</label>
                  <ComboBox
                    options={clientsOptions}
                    placeholder="Elige un cliente..."
                    onChange={(option) => handleChange({ target: { name: "client_id", value: option.value } }, setFormData, onChangeExtra)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className='block text-sm font-medium py-2'>Fecha de Solicitud</label>
                  <Input
                    type="date"
                    name="requested_at"
                    value={formData.requested_at}
                    onChange={(e)=> handleChange(e, setFormData, onChangeExtra)}
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium py-2'>Fecha de Primera Ejecución</label>
                  <Input
                    type="date"
                    name="scheduled_at"
                    value={formData.scheduled_at}
                    onChange={(e)=> handleChange(e, setFormData, onChangeExtra)}
                    required
                  />
                </div>
              </div>
            </div>
            <br />
            <div className="flex justify-end">
              <Button type="button" onClick={handleClose}className="mr-4">Cancelar</Button>
              <Button type="submit" className="bg-green-500 text-black hover:bg-green-600">Guardar</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default ModalNewMaintenance