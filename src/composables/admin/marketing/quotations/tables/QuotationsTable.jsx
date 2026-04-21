import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/admin/marketing/quotations/columns'

const QuotationsTable = ({
  data, fetchData, pagination, setPagination, totalPages,
  search, setSearch, searchFields, setSearchFields,
  onView, onApprove, onReject, onDelete, onEdit 
}) => {
  const columnsWithActions = useMemo(() =>
    columns(onView, onApprove, onReject, onDelete, onEdit)  
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
      searchableFields={["code", "customer", "equipment"]}
    />
  )
}

export default QuotationsTable