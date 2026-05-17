import React, {useState, useMemo} from 'react'
import useEntityMutation from '@/hooks/useEntityMutation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TbPlus } from 'react-icons/tb';
import useFetchWorkOrderActionsByWorkOrder from '../../work-order-action/hooks/useFetchWorkOrderActionsByWorkOrder'
import TableWorkOrderActions from '../../work-order-action/tables/GeneralWorkOrderActions'
import ModalNewAction from '../../work-order-action/modals/ModalNewAction';
import ModalShowAction from '../../work-order-action/modals/ModalShowAction';
import { useAuth } from '@/providers/UserContext';

export default function InProgressWorkOrderSection ({ workOrder, setWorkOrder }) {
  const [workStarted, setWorkStarted] = useState(workOrder?.status === "IN_PROGRESS")
  const [formDataStatus, setFormDataStatus] = useState({
    status: "IN_PROGRESS",
  })
  const mutationWorkOrder = useEntityMutation({entityName: "work_order"})
  const { user } = useAuth()
  const [typeModal, setTypeModal] = useState("")
  const [workOrderAction, setWorkOrderAction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  const [search, setSearch] = useState("")
  const [searchFields, setSearchFields] = useState(["action,description"])

  const searchParams = {search, fields: searchFields.join(',') }
  const { data: workOrderActionsData, refetch: refetchWorkOrderActions } = useFetchWorkOrderActionsByWorkOrder(pagination, searchParams, workOrder?.id)
  const totalPages = Math.ceil((workOrderActionsData?.rowCount || 0 )/ pagination.pageSize) || 0

  const handleOpenModal = (type, data = null) => {
    setIsModalOpen(true)
    setTypeModal(type)
    setWorkOrderAction(data)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTypeModal('')
    setWorkOrderAction(null)
  }

  const handleStartWork = async () => {
    setWorkStarted(true)
    await mutationWorkOrder.mutateAsync(
      { action: 'patch', entity: formDataStatus, endpoint: `/api/v1/manager/work_orders/update_status/${workOrder?.id}` },
    )
    setWorkOrder((prev) => ({
      ...prev,
      status: "IN_PROGRESS"
    }))
  }

  return (
    <Card>

      <CardHeader>
        <CardTitle>
          Trabajo en Progreso
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {!workStarted && workOrder?.status === "OPEN" && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleStartWork}
            >
              Iniciar Trabajo
            </Button>
          </div>
        )}

        {workStarted && (
          <>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-1'>
              <Card className='col-span-1 lg:col-span-1'>
                <CardHeader>
                  <CardTitle>Acciones asignadas a la Orden de Trabajo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleOpenModal("new")}
                    className="bg-green-300 text-black hover:bg-green-600 justify-start"
                  >
                    <TbPlus /> Crear Acción
                  </Button>
                  <TableWorkOrderActions
                    handleOpenModal={handleOpenModal}
                    fetchData={refetchWorkOrderActions}
                    data={workOrderActionsData?.rows || []}
                    pagination={pagination}
                    setWorkOrder={setWorkOrderAction}
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
              <ModalNewAction
                isOpen={isModalOpen}
                handleClose={handleCloseModal}
                workOrder={workOrder}
                typeModal={typeModal}
                fetchData={refetchWorkOrderActions}
                user={user}
              />
            )}
            {typeModal === 'show' && (
              <ModalShowAction
                isOpen={isModalOpen}
                handleClose={handleCloseModal}
                workOrderAction={workOrderAction}
              />
            )}
            {/* {typeModal === 'edit' && (
              <ModalUpdateWorkOrder
                isOpen={isModalOpen}
                handleClose={handleCloseModal}
                workOrderAction={workOrderAction}
                fetchData={refetchWorkOrders}
              />
            )} */}
          </>
        )}

      </CardContent>

    </Card>
  )
}