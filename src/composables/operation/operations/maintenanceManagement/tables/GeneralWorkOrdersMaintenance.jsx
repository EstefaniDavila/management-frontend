import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/admin/operations/workOrdersMaintenance/columns'
import useEntityMutation from '@/hooks/useEntityMutation'

const TableWorkOrdersMaintenance = ({ handleOpenModal, data, fetchData, pagination, setPagination, setWorkOrder, setTypeModal, totalPages, search, setSearch, searchFields, setSearchFields }) => {
  const {mutateAsync} = useEntityMutation({entityName : 'work_orders'})

  const handleDelete = async (id) => {
    try {
      await mutateAsync({
        action: 'delete',
        endpoint: `api/v1/admin/work_orders/${id}`
      })
    } catch (error) {
      console.error("Error deleting work order:", error)
    }
  }

  const handleUpdate = (workOrder) => {
    setWorkOrder(workOrder)
    setTypeModal('edit')
    handleOpenModal('edit', workOrder)
  }

  const columnsWithActions = useMemo(() => columns(handleDelete, handleUpdate), [])

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
      searchableFields={["code", "scheduled_date", "status", "maintenance_type"]}
    />
  )
}

export default TableWorkOrdersMaintenance
