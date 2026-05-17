import React, { useState, useEffect } from 'react';
import Modal from '@/components/custom/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useCrud from '@/hooks/useCrud';
import {
    FileText,
    Calendar,
    DollarSign,
    Package,
    CreditCard,
    Truck,
    MapPin,
    Download,
    Printer
} from 'lucide-react';

const ViewOrderdetailsModal = ({ open, setOpen, order }) => {
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const { getModel: getProducts } = useCrud('/api/v1/admin/products');
    const { getModel: getItems } = useCrud('');

    useEffect(() => {
        if (open && order) {
            fetchProducts();
            fetchOrderItems();
        }
    }, [open, order]);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            const productsArray = response.data || (Array.isArray(response) ? response : []);
            setProducts(productsArray);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchOrderItems = async () => {
        setIsLoadingItems(true);
        try {
            const response = await getItems(`/api/v1/admin/purchase_orders/${order.id}/items`);
            const itemsArray = response.data || (Array.isArray(response) ? response : []);
            setOrderItems(itemsArray);
        } catch (error) {
            console.error("Error fetching order items:", error);
        } finally {
            setIsLoadingItems(false);
        }
    };

    const getProductName = (productId) => {
        if (!productId) return 'Producto no encontrado';
        const product = products.find(p => p.id === productId);
        return product ? product.name : productId.substring(0, 8) + '...';
    };

    if (!order) return null;

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
                    <span className="text-sm sm:text-base truncate">Detalle de Orden: {order.orderId}</span>
                </div>
            }
            description={`Proveedor: ${order.proveedor}`}
            size="lg"
            callBack={null}
        >
            <div className="flex flex-col gap-4 sm:gap-6 py-2 h-full max-h-[75vh] overflow-y-auto">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border">
                    <div>
                        <p className="text-[10px] uppercase text-muted-foreground">Número de Orden</p>
                        <p className="text-lg sm:text-xl font-bold font-mono">{order.orderId}</p>
                    </div>
                    <Badge className={`w-fit ${order.status === 'ENTREGADO'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                        }`}>
                        {order.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-[9px] text-muted-foreground">Fecha de Pedido</p>
                            <p className="text-sm font-medium">{formatDate(order.fechaPedido)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-[9px] text-muted-foreground">Fecha Estimada</p>
                            <p className="text-sm font-medium">{formatDate(order.fechaEntrega)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-[9px] text-muted-foreground">Monto Total</p>
                            <p className="text-sm font-bold text-emerald-600">${(order.montoTotal || 0).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-[9px] text-muted-foreground">Estado</p>
                            <p className="text-sm font-medium">{order.status}</p>
                        </div>
                    </div>

                    {order._original?.received_at && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-[9px] text-muted-foreground">Fecha de Recepción</p>
                                <p className="text-sm font-medium">{formatDate(order._original.received_at)}</p>
                            </div>
                        </div>
                    )}
                </div>

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
                                    {isLoadingItems ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-muted-foreground">
                                                <div className="flex justify-center items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                    Cargando productos...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : orderItems.length > 0 ? (
                                        orderItems.map((product, index) => {
                                            const unitCost = parseFloat(product.unit_cost) || 0;
                                            const quantity = parseInt(product.quantity) || 0;
                                            const subtotal = parseFloat(product.total_cost) || (unitCost * quantity);

                                            return (
                                                <tr key={product.id || index} className="hover:bg-muted/30">
                                                    <td className="p-2 sm:p-3 text-xs">{getProductName(product.product_id)}</td>
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
                                        <td className="p-2 sm:p-3 text-right font-bold text-sm">${(order.montoTotal || 0).toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewOrderdetailsModal;
