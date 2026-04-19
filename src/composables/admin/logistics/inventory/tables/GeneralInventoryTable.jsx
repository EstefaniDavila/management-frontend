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
  onEditProduct,
  onDeleteProduct,
  onOpenHistory, 
}) => {

  const columnsWithActions = useMemo(() => columns(
    onEditProduct,    
    null,            
    onOpenHistory,   
    onDeleteProduct   
  ), [onEditProduct, onOpenHistory, onDeleteProduct]);

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