import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/maintenance/columns'
import useEntityMutation from '@/hooks/useEntityMutation'

const TableMaintenances = ({ handleOpenModal, data, fetchData, pagination, setPagination, setMaintenance, setTypeModal, totalPages, search, setSearch, searchFields, setSearchFields }) => {
  const {mutateAsync} = useEntityMutation({entityName : 'category'})

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

  const handleUpdate = (category) => {
    setCategory(category)
    setTypeModal('edit')
    handleOpenModal('edit', category)
  }

  const columnsWithActions = useMemo(() => columns(handleDelete, handleUpdate))

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
      searchableFields={["code", "equipment", "maintenance_type", "technician", "date", "status"]}
    />
  )
}

export default TableMaintenances
