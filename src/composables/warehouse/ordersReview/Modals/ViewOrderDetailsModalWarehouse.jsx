import React, { useState, useEffect } from 'react';
import Modal from '@/components/custom/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Calendar,
    DollarSign,
    Package,
    Truck,
    Download,
    Printer
} from 'lucide-react';
import useCrud from '@/hooks/useCrud';

const ViewOrderDetailsModalWarehouse = ({
    open,
    setOpen,
    order: selectedOrderSummary,
    onPrint,
    onDownloadPDF
}) => {
    const [orderDetail, setOrderDetail] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { getModel } = useCrud();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (open && selectedOrderSummary?.id) {
                setIsLoading(true);
                try {
                    const response = await getModel(`/api/v1/warehouse/purchase_orders/${selectedOrderSummary.id}`);
                    const data = response?.data || response;

                    setOrderDetail(data);

                    if (data?.items) {
                        setOrderItems(data.items);
                    } else if (data?.purchase_order_items) {
                        setOrderItems(data.purchase_order_items);
                    }
                } catch (error) {
                    console.error("Error fetching order details:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchOrderDetails();
    }, [open, selectedOrderSummary]);

    const calculatedTotal = orderItems.reduce((acc, item) => {
        const unitCost = parseFloat(item.unitCost || item.unit_cost) || 0;
        const quantity = parseInt(item.quantity) || 0;
        const subtotal = parseFloat(item.totalCost || item.total_cost) || (unitCost * quantity);
        return acc + subtotal;
    }, 0);

    const order = {
        ...selectedOrderSummary,
        ...(orderDetail || {}),
        orderId: orderDetail?.code || selectedOrderSummary?.orderId,
        proveedor: orderDetail?.supplier?.name || orderDetail?.supplier_name || selectedOrderSummary?.proveedor,
        fechaPedido: orderDetail?.order_date || orderDetail?.created_at || selectedOrderSummary?.fechaPedido,
        fechaEntrega: orderDetail?.expected_date || orderDetail?.expected_delivery_date || orderDetail?.received_at || selectedOrderSummary?.fechaEntrega,
        montoTotal: parseFloat(orderDetail?.total || orderDetail?.total_amount || orderDetail?.total_cost || calculatedTotal || selectedOrderSummary?.montoTotal || 0),
        status: orderDetail?.status || selectedOrderSummary?.status,
        receivedAt: orderDetail?.received_at || selectedOrderSummary?.receivedAt,
    };
    if (!order || !order.id) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString.split('T')[0] || 'No especificada';
        return date.toLocaleDateString('es-PE');
    };

    return (
        <Modal
            open={open}
            setOpen={setOpen}
            title={
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <span className="text-sm sm:text-base truncate">
                        Detalle de Orden: {order.orderId}
                    </span>
                </div>
            }
            description={`Proveedor: ${order.proveedor || 'No especificado'}`}
            size="lg"
            callBack={null}
        >
            <div className="flex flex-col gap-4 sm:gap-6 py-2 h-full max-h-[75vh] overflow-y-auto">
                {/* Header con número de orden y estado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border">
                    <div>
                        <p className="text-[10px] uppercase text-muted-foreground">Número de Orden</p>
                        <p className="text-lg sm:text-xl font-bold font-mono">{order.orderId}</p>
                    </div>
                    <Badge className={`w-fit ${order.status === 'ENTREGADO'
                        ? 'bg-green-500'
                        : order.status === 'PENDIENTE'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                        }`}>
                        {order.status || 'PENDIENTE'}
                    </Badge>
                </div>

                {/* Grid de información */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoCard
                        icon={Calendar}
                        label="Fecha de Pedido"
                        value={formatDate(order.fechaPedido)}
                    />

                    <InfoCard
                        icon={Calendar}
                        label="Fecha Estimada"
                        value={formatDate(order.fechaEntrega)}
                    />

                    <InfoCard
                        icon={DollarSign}
                        label="Monto Total"
                        value={`$${(order.montoTotal || 0).toLocaleString()}`}
                        valueClassName="font-bold text-emerald-600"
                    />

                    <InfoCard
                        icon={Truck}
                        label="Estado"
                        value={order.status || 'PENDIENTE'}
                    />

                    {order.receivedAt && (
                        <InfoCard
                            icon={Package}
                            label="Fecha de Recepción"
                            value={formatDate(order.receivedAt)}
                        />
                    )}
                </div>

                {/* Tabla de productos */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Package className="h-3 w-3" />
                        Productos {orderItems.length > 0 && `(${orderItems.length})`}
                    </h3>

                    <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[400px]">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs">Producto</th>
                                        <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs">Cant.</th>
                                        <th className="p-2 sm:p-3 text-right text-[10px] sm:text-xs">Precio</th>
                                        <th className="p-2 sm:p-3 text-right text-[10px] sm:text-xs">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-muted-foreground">
                                                <div className="flex justify-center items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                    Cargando productos...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : orderItems.length > 0 ? (
                                        orderItems.map((item, index) => {
                                            const unitCost = parseFloat(item.unitCost || item.unit_cost) || 0;
                                            const quantity = parseInt(item.quantity) || 0;
                                            const subtotal = parseFloat(item.totalCost || item.total_cost) || (unitCost * quantity);

                                            return (
                                                <tr key={item.id || index} className="hover:bg-muted/30">
                                                    <td className="p-2 sm:p-3 text-xs">
                                                        {item.productName || item.product?.name || item.product_name || `Producto ID: ${item.productId || item.product_id}`}
                                                    </td>
                                                    <td className="p-2 sm:p-3 text-center text-xs">{quantity}</td>
                                                    <td className="p-2 sm:p-3 text-right text-xs">${unitCost.toFixed(2)}</td>
                                                    <td className="p-2 sm:p-3 text-right text-xs font-medium">${subtotal.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-muted-foreground">
                                                No hay productos registrados para esta orden
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="bg-muted/30 border-t">
                                    <tr>
                                        <td colSpan="3" className="p-2 sm:p-3 text-right font-bold text-xs">Total:</td>
                                        <td className="p-2 sm:p-3 text-right font-bold text-sm">
                                            ${(order.montoTotal || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 sticky bottom-0 bg-background py-2">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto gap-2"
                        onClick={onPrint || (() => window.print())}
                    >
                        <Printer className="h-4 w-4" />
                        Imprimir
                    </Button>
                    <Button
                        variant="default"
                        className="w-full sm:w-auto gap-2"
                        onClick={onDownloadPDF || (() => alert('Función de descarga no implementada'))}
                    >
                        <Download className="h-4 w-4" />
                        Descargar PDF
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

// Componente auxiliar para las tarjetas de información
const InfoCard = ({ icon: Icon, label, value, valueClassName = "text-sm font-medium" }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div>
            <p className="text-[9px] text-muted-foreground">{label}</p>
            <p className={valueClassName}>{value}</p>
        </div>
    </div>
);

export default ViewOrderDetailsModalWarehouse;