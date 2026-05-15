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
import ViewOrderDetailsModalWarehouse from '@/composables/warehouse/ordersReview/Modals/ViewOrderDetailsModalWarehouse';
import useCrud from '@/hooks/useCrud';
import useEntityMutation from '@/hooks/useEntityMutation';

const ReceivedOrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [search, setSearch] = useState("");
    const [searchFields, setSearchFields] = useState(["orderId", "proveedor"]);
    const [filterProveedor, setFilterProveedor] = useState("todos");
    const [typeModal, setTypeModal] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { getModel: getOrdersModel } = useCrud('/api/v1/warehouse/purchase_orders');
    const { getModel: getSuppliersModel } = useCrud('/api/v1/warehouse/suppliers');
    const orderMutation = useEntityMutation({ entityName: 'purchase_orders' });

    const fetchOrders = async () => {
        try {
            const [ordersResponse, suppliersResponse] = await Promise.all([
                getOrdersModel(),
                getSuppliersModel().catch(() => []) // Fallback in case suppliers fail
            ]);

            const fetchedOrders = Array.isArray(ordersResponse) ? ordersResponse : (ordersResponse?.data || []);
            const fetchedSuppliers = Array.isArray(suppliersResponse) ? suppliersResponse : (suppliersResponse?.data || []);

            const supplierMap = fetchedSuppliers.reduce((acc, supplier) => {
                acc[supplier.id] = supplier.name || supplier.business_name || supplier.company_name;
                return acc;
            }, {});

            const mappedOrders = fetchedOrders.map(item => ({
                id: item.id,
                orderId: item.code || `PO-${item.id}`,
                proveedor: item.supplier?.name || item.supplier_name || supplierMap[item.supplier_id] || "Desconocido",
                fechaPedido: item.order_date || item.created_at,
                fechaEntrega: item.received_at || item.expected_date || null,
                montoTotal: parseFloat(item.total || item.total_amount || 0),
                notas: item.notes || "Sin notas",
                status: item.status,
                _original: item,
            }));

            setOrders(mappedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleOpenModal = (type, order) => {
        setTypeModal(type);
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleReceiveOrder = async (order) => {
        try {
            await orderMutation.mutateAsync({
                action: 'update',
                entity: {},
                endpoint: `/api/v1/admin/purchase_orders/${order.id}/receive`
            });
            fetchOrders();
        } catch (error) {
            console.error("Error al recibir orden:", error);
        }
    };

    const handleCancelOrder = async (order) => {
        try {
            await orderMutation.mutateAsync({
                action: 'update',
                entity: {},
                endpoint: `/api/v1/warehouse/purchase_orders/${order.id}/cancel`
            });
            fetchOrders();
        } catch (error) {
            console.error("Error al cancelar orden:", error);
        }
    };

    const pendientes = orders.filter(o => o.status === "sent" || o.status === "partially_received").length;

    const filteredData = useMemo(() => {
        return filterProveedor === "todos" ? orders : orders.filter(o => o.proveedor === filterProveedor);
    }, [orders, filterProveedor]);

    const proveedoresUnicos = [...new Set(orders.map(o => o.proveedor))].filter(Boolean);
    const totalPages = Math.ceil(filteredData.length / pagination.pageSize);

    return (
        <div className="px-4 py-4 md:px-6 w-full">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-3">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PackageCheck className="h-5 w-5 text-green-600" />
                        <h1 className="text-base font-semibold">Revisión de Órdenes</h1>
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
                        fetchData={fetchOrders}
                        pagination={pagination}
                        setPagination={setPagination}
                        totalPages={totalPages}
                        search={search}
                        setSearch={setSearch}
                        searchFields={searchFields}
                        setSearchFields={setSearchFields}
                        handleOpenModal={handleOpenModal}
                        onReceiveOrder={handleReceiveOrder}
                        onCancelOrder={handleCancelOrder}
                    />
                </div>

                {typeModal === 'details' && (
                    <ViewOrderDetailsModalWarehouse
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