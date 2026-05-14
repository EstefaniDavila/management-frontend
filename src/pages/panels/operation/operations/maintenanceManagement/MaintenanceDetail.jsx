import React, {useState} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TbPlus } from 'react-icons/tb';
import TableWorkOrdersMaintenance from '@/composables/operation/operations/maintenanceManagement/tables/GeneralWorkOrdersMaintenance';
import ModalNewMaintenance from '@/composables/admin/operations/maintenance/modals/ModalNewMaintenance';
import useFetchWorkOrdersByMaintenance from '@/composables/operation/operations/maintenanceManagement/hooks/useFetchWorkOrdersByMaintenance';
import { useParams } from 'react-router-dom'


const MaintenanceDetail = () => {
  const { id } = useParams()
  console.log("Maintenance ID:", id) // Agrega este log para verificar el valor de maintenanceId
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
              <TbPlus /> Crear Mantenimiento
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
        <ModalNewMaintenance
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          typeModal={typeModal}
          fetchData={refetchWorkOrders}
        />
      )}
      {/* {typeModal === 'edit' && (
        <ModalUpdateCategory
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          category={category}
          fetchData={refetchCategories}
        />
      )} */}
    </>
  )
}

export default MaintenanceDetail