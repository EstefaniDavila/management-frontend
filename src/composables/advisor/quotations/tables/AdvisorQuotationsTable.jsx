import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/advisor/quotations/columns'

const AdvisorQuotationsTable = ({
  data, fetchData, pagination, setPagination, totalPages,
  search, setSearch, searchFields, setSearchFields,
  onView, onSend, onApprove, onReject,
}) => {
  const cols = useMemo(() => columns(onView, onSend, onApprove, onReject), [onView, onSend, onApprove, onReject])
  return (
    <DataTable
      columns={cols} data={data} fetchData={fetchData}
      pagination={pagination} setPagination={setPagination} totalPages={totalPages}
      search={search} setSearch={setSearch}
      searchFields={searchFields} setSearchFields={setSearchFields}
      searchableFields={['code', 'customer', 'equipment']}
    />
  )
}
export default AdvisorQuotationsTable