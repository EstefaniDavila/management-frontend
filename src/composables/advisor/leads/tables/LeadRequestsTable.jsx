import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/advisor/leads/columns'

const LeadRequestsTable = ({
  data, fetchData, pagination, setPagination, totalPages,
  search, setSearch, searchFields, setSearchFields,
  onView, onConvert,
}) => {
  const cols = useMemo(() => columns(onView, onConvert), [onView, onConvert])
  return (
    <DataTable
      columns={cols} data={data} fetchData={fetchData}
      pagination={pagination} setPagination={setPagination} totalPages={totalPages}
      search={search} setSearch={setSearch}
      searchFields={searchFields} setSearchFields={setSearchFields}
      searchableFields={['company', 'name', 'description']}
    />
  )
}
export default LeadRequestsTable