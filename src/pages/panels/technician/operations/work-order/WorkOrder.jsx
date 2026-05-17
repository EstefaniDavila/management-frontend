import React, {useState} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TbPlus } from 'react-icons/tb';
import TableWorkOrders from '@/composables/technician/operations/work-order/tables/GeneralWorkOrder';
import useFetchWorkOrdersByTechnician from '@/composables/technician/operations/work-order/hooks/useFetchWorkOrdersByTechnician';
import { useAuth } from '@/providers/UserContext';

const WorkOrder = () => {
  const { user, authTokens } = useAuth('')
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
  const { data: workOrdersData, refetch: refetchWorkOrders } = useFetchWorkOrdersByTechnician(pagination, searchParams, user?.roleable?.id)
  const totalPages = Math.ceil((workOrdersData?.rowCount || 0 )/ pagination.pageSize) || 0
  console.log('workOrdersData', workOrdersData) 
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
            <CardTitle>Mis Ordenes de Trabajo</CardTitle>
          </CardHeader>
          <CardContent>
            <TableWorkOrders
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
      {/* {typeModal === 'show' && (
        <ModalNewMaintenance
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          typeModal={typeModal}
          fetchData={refetchWorkOrders}
        />
      )} */}
    </>
  )
}

export default WorkOrder