import React, { useMemo } from 'react';
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
}) => {

    const handleDetails = (order) => handleOpenModal('details', order);

    const columnsWithActions = useMemo(() =>
        columns(handleDetails),
        [handleDetails]
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

export default OrdersSuppliersReviewTable;