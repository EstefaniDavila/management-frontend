import React, {useState} from 'react'
import Modal from '@/components/custom/modal'
import useEntityMutation from '@/hooks/useEntityMutation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { handleChange } from '@/services/general/handlers'
import ComboBox from '@/components/custom/dan_combobox'
import useFetchSalesOrders from '../hooks/useFetchSaleOrders'


const ModalNewDispatch = ({ isOpen, handleClose, rental, user }) =>{
  const [formData, setFormData] = useState({
    code: "",
    status: "pending",
    dispatched_at: "",
    delivered_at: rental?.delivery_date || "",
    prepared_by_id: user?.id || "",
    sales_order_id: "",
    rental_id: rental?.id || ""
  })
  const mutation = useEntityMutation({entityName: "dispatch_order"})

  const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 10})
  const [search, setSearch] = useState("")
  const [searchFields, setSearchFields] = useState([""])
  const searchParams = {search, fields: searchFields.join(',') }
  const { data: salesOrdersData } = useFetchSalesOrders(pagination, searchParams)
  const salesOrdersOptions = salesOrdersData?.rows?.map((salesOrder) => ({
    value: salesOrder.id,
    label: salesOrder.code
  })) || []
  const handleSubmit = async() => {
    console.log(formData)
    mutation.mutate(
      { action: 'create', entity: formData, endpoint: '/api/v1/admin/dispatch_orders' },
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
          title="Crear Orden de Despacho"
          description="Completa el formulario para crear una nueva orden de despacho"
          size="lg"
          callBack={handleSubmit}
        >
          <form onSubmit={handleSubmit}>
            <div>
              <label className='block text-sm font-medium py-2'>Código</label>
              <Input
                placeholder='Ej: DESP-2026-0001'
                onChange={(e) => handleChange({ target: { name: "code", value: e.target.value } }, setFormData, onChangeExtra) }
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium py-2'>Fecha de Despacho</label>
              <Input
                type="datetime-local"
                name="dispatched_at"
                value={formData.dispatched_at}
                onChange={(e)=> handleChange(e, setFormData, onChangeExtra)}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium py-2'>Orden de Venta</label>
              <ComboBox
                options={salesOrdersOptions}
                placeholder="Elige un orden de venta..."
                onChange={(option) => handleChange({ target: { name: "sales_order_id", value: option.value } }, setFormData, onChangeExtra)}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default ModalNewDispatch