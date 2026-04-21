import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/admin/marketing/salesOrders/columns'

const SalesOrdersTable = ({
  data, fetchData, pagination, setPagination, totalPages,
  search, setSearch, searchFields, setSearchFields,
  onView, onEdit, onDelete
}) => {
  const cols = useMemo(() => columns(onView, onEdit, onDelete), [onView, onEdit, onDelete])

  return (
    <DataTable
      columns={cols}
      data={data}
      fetchData={fetchData}
      pagination={pagination}
      setPagination={setPagination}
      totalPages={totalPages}
      search={search}
      setSearch={setSearch}
      searchFields={searchFields}
      setSearchFields={setSearchFields}
      searchableFields={["code", "customer", "item_description"]}
    />
  )
}

export default SalesOrdersTable