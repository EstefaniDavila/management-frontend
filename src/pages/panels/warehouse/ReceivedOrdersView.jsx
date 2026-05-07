import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Download, PackageCheck } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import OrdersSuppliersReviewTable from '@/composables/warehouse/ordersReview/table/OrdersSuppliersReview';
import ViewOrderDetailModal from '@/composables/admin/logistics/suppliers/modals/SupplierOrderModal/ViewOrderDetailModal/ViewOrderDetailModal';

const ReceivedOrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [search, setSearch] = useState("");
    const [searchFields, setSearchFields] = useState(["orderId", "proveedor"]);
    const [filterProveedor, setFilterProveedor] = useState("todos");
    const [typeModal, setTypeModal] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchDeliveredOrders = async () => {
        const mockData = [
            { orderId: "PO-2024-001", proveedor: "Maquinarias S.A.", fechaPedido: "2024-01-15", fechaEntrega: "2024-01-22", totalProductos: 15, status: "ENTREGADO", conforme: undefined },
            { orderId: "PO-2024-005", proveedor: "Logística Express", fechaPedido: "2024-02-01", fechaEntrega: "2024-02-08", totalProductos: 32, status: "ENTREGADO", conforme: true },
        ];
        setOrders(mockData);
    };

    useEffect(() => { fetchDeliveredOrders(); }, []);

    const handleOpenModal = (type, data) => {
        setTypeModal(type);
        setSelectedOrder(data);
        setIsModalOpen(true);
    };

    const handleConfirm = (order, isConforme) => {
        setOrders(prev => prev.map(o =>
            o.orderId === order.orderId
                ? { ...o, conforme: isConforme }
                : o
        ));
    };

    const pendientes = orders.filter(o => o.status === "ENTREGADO" && o.conforme === undefined).length;

    const filteredData = useMemo(() => {
        return filterProveedor === "todos" ? orders : orders.filter(o => o.proveedor === filterProveedor);
    }, [orders, filterProveedor]);

    const proveedoresUnicos = [...new Set(orders.map(o => o.proveedor))];
    const totalPages = Math.ceil(filteredData.length / pagination.pageSize);

    return (
        <div className="px-4 py-4 md:px-6 w-full">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-3">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PackageCheck className="h-5 w-5 text-green-600" />
                        <h1 className="text-base font-semibold">Pedidos Recibidos</h1>
                        {pendientes > 0 && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                {pendientes} pendientes
                            </span>
                        )}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => console.log("Exportar")} className="gap-1">
                        <Download className="h-3.5 w-3.5" /> Exportar
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1">
                                <Filter className="h-3 w-3" /> Proveedor: {filterProveedor === "todos" ? "Todos" : filterProveedor.split(' ')[0]}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterProveedor("todos")}>Todos</DropdownMenuItem>
                            {proveedoresUnicos.map(prov => (
                                <DropdownMenuItem key={prov} onClick={() => setFilterProveedor(prov)}>{prov}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
                    <OrdersSuppliersReviewTable
                        data={filteredData}
                        fetchData={fetchDeliveredOrders}
                        pagination={pagination}
                        setPagination={setPagination}
                        totalPages={totalPages}
                        search={search}
                        setSearch={setSearch}
                        searchFields={searchFields}
                        setSearchFields={setSearchFields}
                        handleOpenModal={handleOpenModal}
                        onConfirmOrder={handleConfirm}
                    />
                </div>

                {typeModal === 'details' && (
                    <ViewOrderDetailModal
                        open={isModalOpen}
                        setOpen={() => setIsModalOpen(false)}
                        order={selectedOrder}
                    />
                )}

            </div>
        </div>
    );
};

export default ReceivedOrdersView;