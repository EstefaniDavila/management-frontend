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
    Truck,
    Download,
    Printer
} from 'lucide-react';

const ViewOrderDetailModal = ({ open, setOpen, order, supplier }) => {
    const [products, setProducts] = useState([]);
    const { getModel: getProducts } = useCrud('/api/v1/admin/products');

    useEffect(() => {
        if (open) {
            fetchProducts();
        }
    }, [open]);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            const productsArray = response.data || (Array.isArray(response) ? response : []);
            setProducts(productsArray);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const getProductName = (productId) => {
        if (!productId) return 'Producto no encontrado';
        const product = products.find(p => p.id === productId);
        return product ? product.name : productId.substring(0, 8) + '...';
    };

    if (!order || !supplier) return null;

    const orderProducts = order.items || [];

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString.split('T')[0] || 'No especificada';
        return date.toLocaleDateString('es-PE');
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return { label: 'Completado', className: 'bg-green-500' };
            case 'draft':
                return { label: 'Pendiente', className: 'bg-yellow-500' };
            case 'sent':
                return { label: 'Enviado', className: 'bg-blue-500' };
            case 'partially_received':
                return { label: 'Recibido Parcial', className: 'bg-purple-500' };
            case 'cancelled':
                return { label: 'Cancelado', className: 'bg-red-500' };
            default:
                return { label: status || 'Pendiente', className: 'bg-gray-500' };
        }
    };

    const statusInfo = getStatusBadge(order.status);

    const totalAmount = parseFloat(order.total) || 0;

    return (
        <Modal
            open={open}
            setOpen={setOpen}
            title={
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <span className="text-sm sm:text-base truncate">Detalle de Orden: {order.code}</span>
                </div>
            }
            description={`Proveedor: ${supplier.nombre} | RUC: ${supplier.ruc || 'N/A'}`}
            size="lg"
            callBack={null}
        >
            <div className="flex flex-col gap-4 sm:gap-6 py-2 h-full max-h-[75vh] overflow-y-auto">
                {/* Cabecera */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border">
                    <div>
                        <p className="text-[10px] uppercase text-muted-foreground">Número de Orden</p>
                        <p className="text-lg sm:text-xl font-bold font-mono">{order.code}</p>
                        {order.notes && (
                            <p className="text-xs text-muted-foreground mt-1">Nota: {order.notes}</p>
                        )}
                    </div>
                    <Badge className={`w-fit ${statusInfo.className} text-white`}>
                        {statusInfo.label}
                    </Badge>
                </div>

                {/* Información general */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-[9px] text-muted-foreground">Fecha de Creación</p>
                            <p className="text-sm font-medium">{formatDate(order.created_at)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-[9px] text-muted-foreground">Fecha Estimada</p>
                            <p className="text-sm font-medium">{formatDate(order.expected_date)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-[9px] text-muted-foreground">Monto Total</p>
                            <p className="text-sm font-bold text-emerald-600">
                                ${totalAmount.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-[9px] text-muted-foreground">Estado</p>
                            <p className="text-sm font-medium">{statusInfo.label}</p>
                        </div>
                    </div>

                    {order.received_at && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-[9px] text-muted-foreground">Fecha de Recepción</p>
                                <p className="text-sm font-medium">{formatDate(order.received_at)}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabla de Productos */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Package className="h-3 w-3" />
                        Productos {orderProducts.length > 0 && `(${orderProducts.length})`}
                    </h3>

                    <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[400px]">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs">Producto</th>
                                        <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs">Cantidad</th>
                                        <th className="p-2 sm:p-3 text-right text-[10px] sm:text-xs">Precio Unit.</th>
                                        <th className="p-2 sm:p-3 text-right text-[10px] sm:text-xs">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {orderProducts.length > 0 ? (
                                        orderProducts.map((product, index) => (
                                            <tr key={product.id || index} className="hover:bg-muted/30">
                                                <td className="p-2 sm:p-3 text-xs">
                                                    {getProductName(product.product_id)}
                                                </td>
                                                <td className="p-2 sm:p-3 text-center text-xs">
                                                    {product.quantity}
                                                </td>
                                                <td className="p-2 sm:p-3 text-right text-xs">
                                                    ${parseFloat(product.unit_cost).toFixed(2)}
                                                </td>
                                                <td className="p-2 sm:p-3 text-right text-xs font-medium">
                                                    ${parseFloat(product.total_cost).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-muted-foreground">
                                                No hay productos registrados para esta orden
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                {orderProducts.length > 0 && (
                                    <tfoot className="bg-muted/30 border-t">
                                        <tr>
                                            <td colSpan="3" className="p-2 sm:p-3 text-right font-bold text-xs">Total:</td>
                                            <td className="p-2 sm:p-3 text-right font-bold text-sm">
                                                ${totalAmount.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 sticky bottom-0 bg-background py-2">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto gap-2"
                        onClick={() => window.print()}
                    >
                        <Printer className="h-4 w-4" />
                        Imprimir
                    </Button>
                    <Button
                        variant="default"
                        className="w-full sm:w-auto gap-2"
                        onClick={() => {
                            alert(`Generando PDF para la orden ${order.code}...\nPróximamente disponible`);
                        }}
                    >
                        <Download className="h-4 w-4" />
                        Descargar PDF
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ViewOrderDetailModal;