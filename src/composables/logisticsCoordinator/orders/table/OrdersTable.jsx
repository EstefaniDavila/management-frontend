import React, { useMemo } from 'react';
import DataTable from '@/components/custom/data_table';
import columns from '@/services/logisticsCoordinator/orders/column';

const OrdersTable = ({
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
  handleMarkDelivered,
  handleDownloadGuide,
}) => {

  const handleEdit = (order) => handleOpenModal('edit', order);
  const handleDelete = (order) => handleOpenModal('delete', order);
  const handleDetails = (order) => handleOpenModal('details', order);

  const columnsWithActions = useMemo(() =>
    columns(handleEdit, handleDetails, handleDelete, handleMarkDelivered, handleDownloadGuide),
    [handleEdit, handleDelete, handleDetails, handleMarkDelivered, handleDownloadGuide]
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

export default OrdersTable;