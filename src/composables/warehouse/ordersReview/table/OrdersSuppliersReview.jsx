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
    onReceiveOrder,
    onCancelOrder,
    handleDownloadGuide,
}) => {

    const handleDetails = useCallback((order) => {
        handleOpenModal('details', order);
    }, [handleOpenModal]);

    const handleReceive = useCallback((order) => {
        onReceiveOrder(order);
    }, [onReceiveOrder]);

    const handleCancel = useCallback((order) => {
        onCancelOrder(order);
    }, [onCancelOrder]);

    const columnsWithActions = useMemo(() =>
        columns(handleDetails, handleReceive, handleCancel, handleDownloadGuide),
        [handleDetails, handleReceive, handleCancel, handleDownloadGuide]
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