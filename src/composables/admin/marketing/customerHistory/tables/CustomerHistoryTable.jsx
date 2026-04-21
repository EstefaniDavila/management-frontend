import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/admin/marketing/customerHistory/columns'

const CustomerHistoryTable = ({
  data, fetchData, pagination, setPagination, totalPages,
  search, setSearch, searchFields, setSearchFields, onView
}) => {
  const cols = useMemo(() => columns(onView), [onView])

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
      searchableFields={["business_name", "document_number", "contact_name"]}
    />
  )
}

export default CustomerHistoryTable