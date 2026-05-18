import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/admin/operations/equipmentRental/columns'
import useEntityMutation from '@/hooks/useEntityMutation'

const TableRentals = ({ handleOpenModal, data, fetchData, pagination, setPagination, setRental, setTypeModal, totalPages, search, setSearch, searchFields, setSearchFields }) => {
  const {mutateAsync} = useEntityMutation({entityName : 'rental'})

  const handleDelete = async (id) => {
    console.log(`/api/v1/manager/rentals/${id}`)
    try {
      await mutateAsync({
        action: 'delete',
        endpoint: `/api/v1/manager/rentals/${id}`
      })
    } catch (error) {
      console.error("Error deleting rental:", error)
    }
  }

  const handleUpdate = (rental) => {
    setRental(rental)
    setTypeModal('edit')
    handleOpenModal('edit', rental)
  }

  const handleDeliver = (rental) => {
    setRental(rental)
    setTypeModal('deliver')
    handleOpenModal('deliver', rental)
  }

  const columnsWithActions = useMemo(() => columns(handleDelete, handleDeliver), [])

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
      searchableFields={["code", "customer", "equipment", "status"]}
    />
  )
}

export default TableRentals
