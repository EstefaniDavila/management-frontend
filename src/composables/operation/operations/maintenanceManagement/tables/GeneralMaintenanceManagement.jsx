import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/admin/operations/maintenanceManagement/columns'
import useEntityMutation from '@/hooks/useEntityMutation'
import { useNavigate } from 'react-router-dom'

const TableMaintenanceManagement = ({ handleOpenModal, data, fetchData, pagination, setPagination, setMaintenance, setTypeModal, totalPages, search, setSearch, searchFields, setSearchFields }) => {
  const {mutateAsync} = useEntityMutation({entityName : 'maintenance'})
  const navigate = useNavigate()

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

  const handleBuild = (maintenance) => {
    navigate(`/maintenances/${maintenance.id}`)
  }

  const columnsWithActions = useMemo(() => columns(handleBuild))

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
      searchableFields={["code", "customer", "equipment", "maintenance_type", "technician", "date", "status"]}
    />
  )
}

export default TableMaintenanceManagement
