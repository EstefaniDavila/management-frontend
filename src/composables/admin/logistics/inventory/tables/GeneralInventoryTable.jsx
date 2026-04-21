import React, { useMemo } from 'react';
import DataTable from '@/components/custom/data_table';
import columns from '@/services/admin/logistics/inventory/columns';

const GeneralInventoryTable = ({
  data,
  fetchData,
  pagination,
  setPagination,
  totalPages,
  search,
  setSearch,
  searchFields,
  setSearchFields,
  handleOpenModal,
}) => {

  const handleEdit    = (product) => handleOpenModal('edit', product);
  const handleDelete  = (product) => handleOpenModal('delete', product);
  const handleHistory = (product) => handleOpenModal('history', product);

const columnsWithActions = useMemo(() => 
  columns(handleEdit, handleHistory, handleDelete),  // ✅ ORDEN CORRECTO
  [handleEdit, handleDelete, handleHistory]
);

  return (
    <div className="w-full space-y-4">
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
      />
    </div>
  );
};

export default GeneralInventoryTable;