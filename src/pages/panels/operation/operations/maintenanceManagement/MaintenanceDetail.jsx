import React, {useState} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TbPlus } from 'react-icons/tb';
import TableWorkOrdersMaintenance from '@/composables/operation/operations/maintenanceManagement/tables/GeneralWorkOrdersMaintenance';
import ModalNewWorkOrder from '@/composables/operation/operations/maintenanceManagement/modals/ModalNewWorkOrder';
import ModalUpdateWorkOrder from '@/composables/operation/operations/maintenanceManagement/modals/ModalUpdateWorkOrder';
import ModalShowDiagnostive from '@/composables/operation/operations/maintenanceManagement/modals/ModalShowDiagnostive';
import ModalShowActions from '@/composables/operation/operations/maintenanceManagement/modals/ModalShowActions';
import useFetchWorkOrdersByMaintenance from '@/composables/operation/operations/maintenanceManagement/hooks/useFetchWorkOrdersByMaintenance';
import { useParams } from 'react-router-dom'


const MaintenanceDetail = () => {
  const { id } = useParams()
  const [typeModal, setTypeModal] = useState("")
  const [workOrder, setWorkOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  const [search, setSearch] = useState("")
  const [searchFields, setSearchFields] = useState(["code,status"])

  const searchParams = {search, fields: searchFields.join(',') }
  const { data: workOrdersData, refetch: refetchWorkOrders } = useFetchWorkOrdersByMaintenance(pagination, searchParams, id)
  const totalPages = Math.ceil((workOrdersData?.rowCount || 0 )/ pagination.pageSize) || 0
  const handleOpenModal = (type, data = null) => {
    setIsModalOpen(true)
    setTypeModal(type)
    setWorkOrder(data)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTypeModal('')
    setWorkOrder(null)
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-1'>
        <Card className='col-span-1 lg:col-span-1'>
          <CardHeader>
            <CardTitle>Ordenes de Trabajo asignadas al Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleOpenModal("new")}
              className="bg-green-300 text-black hover:bg-green-600 justify-start"
            >
              <TbPlus /> Crear Orden de Trabajo
            </Button>
            <TableWorkOrdersMaintenance
              handleOpenModal={handleOpenModal}
              fetchData={refetchWorkOrders}
              data={workOrdersData?.rows || []}
              pagination={pagination}
              setWorkOrder={setWorkOrder}
              setTypeModal={setTypeModal}
              totalPages={totalPages}
              search={search}
              setSearch={setSearch}
              searchFields={searchFields}
              setSearchFields={setSearchFields}
            />
          </CardContent>
        </Card>
      </div>
      {typeModal === 'new' && (
        <ModalNewWorkOrder
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          typeModal={typeModal}
          fetchData={refetchWorkOrders}
          maintenance_id={id}
        />
      )}
      {typeModal === 'edit' && (
        <ModalUpdateWorkOrder
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          workOrder={workOrder}
          fetchData={refetchWorkOrders}
        />
      )}
      {typeModal === 'show_diagnosis' && (
        <ModalShowDiagnostive
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          workOrder={workOrder}
        />
      )}
      {typeModal === 'show_actions' && (
        <ModalShowActions
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          workOrder={workOrder}
        />
      )}
    </>
  )
}

export default MaintenanceDetail