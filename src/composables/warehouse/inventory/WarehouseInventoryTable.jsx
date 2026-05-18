import React, { useMemo, useCallback } from 'react';
import DataTable from '@/components/custom/data_table';
import columns from '@/services/warehouse/columns';

const WarehouseInventoryTable = ({
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
    const handleEdit = useCallback((product) => handleOpenModal('edit', product), [handleOpenModal]);
    const handleHistory = useCallback((product) => handleOpenModal('history', product), [handleOpenModal]);

    const columnsWithActions = useMemo(() =>
        columns(handleEdit, handleHistory),
        [handleEdit, handleHistory]
    );

    const memoizedFetchData = useCallback(() => {
        if (data.length === 0) {
            fetchData();
        }
    }, [data.length, fetchData]);

    return (
        <div className="w-full space-y-4">
            <DataTable
                columns={columnsWithActions}
                data={data}
                fetchData={memoizedFetchData}
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

export default WarehouseInventoryTable;