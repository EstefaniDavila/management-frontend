import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/technician/operations/work-order/columns'
import useEntityMutation from '@/hooks/useEntityMutation'

const TableWorkOrders = ({ handleOpenModal, data, fetchData, pagination, setPagination, setWorkOrder, setTypeModal, totalPages, search, setSearch, searchFields, setSearchFields }) => {
  const {mutateAsync} = useEntityMutation({entityName : 'workOrder'})

  const handleDelete = async (id) => {
    // try {
    //   await mutateAsync({
    //     action: 'delete',
    //     endpoint: `api/v1/admin/maintenances/${id}`
    //   })
    // } catch (error) {
    //   console.error("Error deleting maintenance:", error)
    // }
  }

  const handleShow = (workOrder) => {
    setWorkOrder(workOrder)
    setTypeModal('show')
    handleOpenModal('show', workOrder)
  }
  const handleBuild = (workOrder) => {
    setWorkOrder(workOrder)
    setTypeModal('build')
    handleOpenModal('build', workOrder)
  }

  const columnsWithActions = useMemo(() => columns(handleShow, handleBuild))

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
      searchableFields={["code", "equipment", "maintenance_type", "customer", "date", "status"]}
    />
  )
}

export default TableWorkOrders
