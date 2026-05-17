import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/technician/operations/work-order-action/columns'
import useEntityMutation from '@/hooks/useEntityMutation'

const TableWorkOrderActions = ({ handleOpenModal, data, fetchData, pagination, setPagination, setWorkOrder, setTypeModal, totalPages, search, setSearch, searchFields, setSearchFields }) => {
  const {mutateAsync} = useEntityMutation({entityName : 'work_order_action'})

  const handleDelete = async (id) => {
    try {
      await mutateAsync({
        action: 'delete',
        endpoint: `/api/v1/manager/work_order_actions/${id}`
      })
    } catch (error) {
      console.error("Error deleting work order action:", error)
    }
  }

  const handleShow = (workOrderAction) => {
    setWorkOrder(workOrderAction)
    setTypeModal('show')
    handleOpenModal('show', workOrderAction)
  }

  const columnsWithActions = useMemo(() => columns(handleShow, handleDelete))

  return (
    <DataTable
      columns={columnsWithActions}
      data={data}
      fetchData={fetchData}
      pagination={pagination}
      setPagination={setPagination}
      totalPages={totalPages}
      search={search}
      setSearch={setSearch}
      searchFields={searchFields}
      setSearchFields={setSearchFields}
      searchableFields={["action", "description"]}
    />
  )
}

export default TableWorkOrderActions
