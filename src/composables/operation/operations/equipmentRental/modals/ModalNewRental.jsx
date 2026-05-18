import React, {useState} from 'react'
import Modal from '@/components/custom/modal'
import useEntityMutation from '@/hooks/useEntityMutation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { handleChange } from '@/services/general/handlers'
import { MdCarRental } from "react-icons/md";
import ComboBox from '@/components/custom/dan_combobox'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select"
import useFetchClients from '@/composables/operation/operations/maintenanceManagement/hooks/useFetchClients'
import useFetchAvailableVehicles from '../hooks/useFetchAvailableVehicles'
import useFetchQuotations from '../hooks/useFetchQuotatios'


const ModalNewRental = ({ isOpen, handleClose }) =>{
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    status: "DRAFT",
    delivery_date: "PENDING",
    return_date: "",
    vehicle_condition_delivery: "",
    vehicle_condition_return: "",
    total: "",
    notes: "",
    quotation_id: "",
    client_id: "",
    vehicle_id: ""
  })
  const mutation = useEntityMutation({entityName: "rental"})

  const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 10})
  const [search, setSearch] = useState("")
  const [searchFields, setSearchFields] = useState([""])
  const searchParams = {search, fields: searchFields.join(',') }
  const { data: clientsData } = useFetchClients(pagination, searchParams)
  const { data: vehiclesData } = useFetchAvailableVehicles(pagination, searchParams)
  const { data: quotationsData } = useFetchQuotations(pagination, searchParams)
  const clientsOptions = clientsData?.rows?.map((client) => ({
    value: client.id,
    label: client.business_name
  })) || []
  const vehiclesOptions = vehiclesData?.rows?.map((vehicle) => ({
    value: vehicle.id,
    label: vehicle.serial
  })) || []
  const quotationsOptions = quotationsData?.rows?.map((quotation) => ({
    value: quotation.id,
    label: quotation.code
  })) || []
  const handleSubmit = async() => {
    mutation.mutate(
      { action: 'create', entity: formData, endpoint: '/api/v1/manager/rentals' },
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
          title="Crear Renta"
          description="Completa el formulario para crear una nueva renta"
          size="lg"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-4">
                <div>
                  <label className='block text-sm font-medium py-2'>Fecha de Inicio</label>
                  <Input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={(e)=> handleChange(e, setFormData, onChangeExtra)}
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium py-2'>Fecha de Fin</label>
                  <Input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={(e)=> handleChange(e, setFormData, onChangeExtra)}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <MdCarRental className="text-[120px] opacity-70" />
              </div>
            </div>

            {/*     SEGUNDA SECCION     */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className='block text-sm font-medium py-2'>Fecha de Entrega</label>
                  <Input
                    type="datetime-local"
                    name="delivery_date"
                    value={formData.delivery_date}
                    onChange={(e)=> handleChange(e, setFormData, onChangeExtra)}
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium py-2'>Condicion del Vehiculo de Salida</label>
                  <Input
                    placeholder='Ej: Pequeños arañazos en la pintura...'
                    onChange={(e) => handleChange({ target: { name: "vehicle_condition_delivery", value: e.target.value } }, setFormData, onChangeExtra) }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium py-2'>Total</label>
                  <Input
                    type="number"
                    placeholder='Ej: 1500.00'
                    onChange={(e) => handleChange({ target: { name: "total", value: e.target.value === "" ? "" : Number(e.target.value) } }, setFormData, onChangeExtra) }
                    required
                  />
                </div>
                {/* <div>
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
                </div> */}
              </div>
              <div className="space-y-4">
                <div>
                  <label className='block text-sm font-medium py-2'>Notas</label>
                  <Input
                    placeholder='Ej: Notas...'
                    onChange={(e) => handleChange({ target: { name: "notes", value: e.target.value } }, setFormData, onChangeExtra) }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium py-2'>Cliente</label>
                  <ComboBox
                    options={clientsOptions}
                    placeholder="Elige un cliente..."
                    onChange={(option) => handleChange({ target: { name: "client_id", value: option.value } }, setFormData, onChangeExtra)}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium py-2'>Vehiculo</label>
                  <ComboBox
                    options={vehiclesOptions}
                    placeholder="Elige un vehículo..."
                    onChange={(option) => handleChange({ target: { name: "vehicle_id", value: option.value } }, setFormData, onChangeExtra)}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium py-2'>Cotizacion</label>
              <ComboBox
                options={quotationsOptions}
                placeholder="Elige una cotización..."
                onChange={(option) => handleChange({ target: { name: "quotation_id", value: option.value } }, setFormData, onChangeExtra)}
              />
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

export default ModalNewRental