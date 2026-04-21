import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/manager/leads/columns'

const TeamLeadsTable = ({
  data, fetchData, pagination, setPagination, totalPages,
  search, setSearch, searchFields, setSearchFields,
  onView, onAssign,
}) => {
  const cols = useMemo(
    () => columns(onView, onAssign),
    [onView, onAssign]
  )

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
      searchableFields={['company', 'name', 'assigned_to']}
    />
  )
}

export default TeamLeadsTable