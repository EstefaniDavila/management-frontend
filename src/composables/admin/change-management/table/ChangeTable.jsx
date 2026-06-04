import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/admin/change-management/columns'

const ChangeTable = ({
  data,
  fetchData,
  pagination,
  setPagination,
  totalPages,
  search,
  setSearch,
  searchFields,
  setSearchFields,
  onView,
  onReview,
  onDelete
}) => {
  const columnsWithActions = useMemo(() =>
    columns(onView, onReview, onDelete),
    [onView, onReview, onDelete]
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
      searchableFields={["title", "change_code"]}
    />
  )
}

export default ChangeTable
