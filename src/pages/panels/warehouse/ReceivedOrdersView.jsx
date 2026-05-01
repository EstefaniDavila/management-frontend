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

const ReceivedOrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [search, setSearch] = useState("");
    const [searchFields, setSearchFields] = useState(["orderId", "proveedor"]);
    const [filterProveedor, setFilterProveedor] = useState("todos");
    const [typeModal, setTypeModal] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDeliveredOrders = async () => {
        try {
            setLoading(true);
            // Simulando API - Reemplaza con tu llamada real
            // const response = await api.get('/purchase-orders', {
            //   params: { status: 'ENTREGADO' }
            // });
            // setOrders(response.data.rows);

            // Datos de ejemplo
            const mockData = [
                {
                    orderId: "PO-2024-001",
                    proveedor: "Maquinarias S.A.",
                    fechaPedido: "2024-01-15",
                    fechaEntrega: "2024-01-22",
                    totalProductos: 15,
                    montoTotal: 12500000,
                    status: "ENTREGADO"
                },
                {
                    orderId: "PO-2024-005",
                    proveedor: "Logística Express",
                    fechaPedido: "2024-02-01",
                    fechaEntrega: "2024-02-08",
                    totalProductos: 32,
                    montoTotal: 2100000,
                    status: "ENTREGADO"
                },
            ];
            setOrders(mockData);
        } catch (error) {
            console.error('Error loading delivered orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveredOrders();
    }, []);

    const refetchData = () => {
        // Refrescar datos
        fetchDeliveredOrders();
    };

    const handleOpenModal = (type, order = null) => {
        setTypeModal(type);
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setTypeModal("");
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    const proveedoresUnicos = useMemo(() =>
        [...new Set(orders.map(o => o.proveedor))],
        [orders]
    );

    const filteredData = useMemo(() => {
        let filtered = orders;

        if (filterProveedor !== "todos") {
            filtered = filtered.filter(item => item.proveedor === filterProveedor);
        }

        return filtered;
    }, [orders, filterProveedor]);

    const totalPages = Math.ceil(filteredData.length / pagination.pageSize);

    if (loading) {
        return <div className="p-8 text-center">Cargando pedidos recibidos...</div>;
    }

    // ... (resto del código igual arriba)

    return (
        <div className="px-4 py-4 md:px-6 w-full">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-4">

                {/* Título de la vista */}
                <div className="flex items-center gap-3">
                    <PackageCheck className="h-6 w-6 text-green-600" />
                    <h1 className="text-base font-semibold tracking-tight text-foreground">
                        Pedidos Recibidos
                    </h1>
                </div>

                {/* Barra de herramientas: Filtros y Exportar (Más cerca de la tabla) */}
                <div className="flex items-center justify-between gap-2 bg-background/95 pb-2">
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Filter className="h-3.5 w-3.5" />
                                    Proveedor: {filterProveedor === "todos" ? "Todos" : filterProveedor.split(' ')[0]}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-h-64 overflow-y-auto">
                                <DropdownMenuItem onClick={() => setFilterProveedor("todos")}>
                                    Todos los proveedores
                                </DropdownMenuItem>
                                {proveedoresUnicos.map(prov => (
                                    <DropdownMenuItem key={prov} onClick={() => setFilterProveedor(prov)}>
                                        {prov}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Botón de exportar movido aquí para estar pegado a la tabla */}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => console.log("Exportar reporte")}
                        className="gap-2"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Exportar Reporte
                    </Button>
                </div>

                {/* Tabla de contenido */}
                <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
                    <OrdersSuppliersReviewTable
                        data={filteredData}
                        fetchData={refetchData}
                        pagination={pagination}
                        setPagination={setPagination}
                        totalPages={totalPages}
                        search={search}
                        setSearch={setSearch}
                        searchFields={searchFields}
                        setSearchFields={setSearchFields}
                        handleOpenModal={handleOpenModal}
                    />
                </div>
            </div>

            {/* ... (Modales abajo) */}
        </div>
    );
};

export default ReceivedOrdersView;