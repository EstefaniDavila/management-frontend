import React, { useMemo } from 'react';
import DataTable from '@/components/custom/data_table';
import columns from '@/services/admin/logistics/suppliers/columns';

const GeneralProveedoresTable = ({
    data,
    fetchData,
    pagination,
    setPagination,
    totalPages,
    search,
    setSearch,
    searchFields,
    setSearchFields,
    onEditProveedor,
    onDeleteProveedor,
    onViewDetails,
    onCreateOrder,
}) => {

    const columnsWithActions = useMemo(() => columns(
        onEditProveedor,
        onDeleteProveedor,
        onViewDetails,
        onCreateOrder
    ), [onEditProveedor, onDeleteProveedor, onViewDetails, onCreateOrder]);

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

export default GeneralProveedoresTable;