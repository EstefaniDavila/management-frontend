import React, { useMemo } from 'react';
import DataTable from '@/components/custom/data_table';
import columns from '@/services/logisticsCoordinator/suppliers/column';

const LogisticSupplierTable = ({
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

    const handleViewDetails = (proveedor) => handleOpenModal('details', proveedor);
    const handleCreateOrder = (proveedor) => handleOpenModal('create', proveedor);

    const columnsWithActions = useMemo(() => columns(
        handleViewDetails,
        handleCreateOrder
    ), [handleOpenModal]);

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
                searchableFields={["nombre", "ruc", "codigo", "email", "telefono"]}
            />
        </div>
    );
};

export default LogisticSupplierTable;