import React, { useMemo, useCallback } from 'react';
import DataTable from '@/components/custom/data_table';
import columns from '@/services/warehouse/ordersReview/column';

const OrdersSuppliersReviewTable = ({
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
    onConfirmOrder,
}) => {

    const handleDetails = useCallback((order) => {
        handleOpenModal('details', order);
    }, [handleOpenModal]);
    const handleConfirmReception = useCallback((order, isConforme) => {
        onConfirmOrder(order, isConforme, '');
    }, [onConfirmOrder]);
    const columnsWithActions = useMemo(() =>
        columns(handleDetails, handleConfirmReception),
        [handleDetails, handleConfirmReception]
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
                setSearchFields={searchFields}
            />
        </div>
    );
};

export default OrdersSuppliersReviewTable;