import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/admin/marketing/customers/columns'

const CustomersTable = ({
  data, fetchData, pagination, setPagination, totalPages,
  search, setSearch, searchFields, setSearchFields,
  onView, onEdit, onDelete
}) => {
  const columnsWithActions = useMemo(() =>
    columns(onView, onEdit, onDelete)
  )

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
      searchableFields={["business_name", "document_number", "email"]}
    />
  )
}

export default CustomersTable