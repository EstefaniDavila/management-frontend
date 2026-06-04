import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import columns from '@/services/admin/general-management/users/columns'

const UsersTable = ({
  data, fetchData, pagination, setPagination, totalPages,
  search, setSearch, searchFields, setSearchFields,
  onView, onEdit, onDelete, onToggleStatus, onResetPassword
}) => {
  const columnsWithActions = useMemo(() =>
    columns(onView, onEdit, onDelete, onToggleStatus, onResetPassword),
    [onView, onEdit, onDelete, onToggleStatus, onResetPassword]
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
      searchableFields={["document_number", "email"]}
    />
  )
}

export default UsersTable
