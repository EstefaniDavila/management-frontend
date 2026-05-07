import React from 'react';
import Modal from '@/components/custom/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    if (!order) return null;

    const orderProducts = [
        { id: 1, nombre: "Filtro de aceite", cantidad: 10, precio: 45.50, subtotal: 455.00 },
        { id: 2, nombre: "Batería 12V", cantidad: 2, precio: 120.00, subtotal: 240.00 },
        { id: 3, nombre: "Correa de distribución", cantidad: 5, precio: 35.00, subtotal: 175.00 },
    ];

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
                            <p className="text-sm font-medium">{order.fechaPedido}</p>
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
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-[9px] text-muted-foreground">Método de Pago</p>
                            <p className="text-sm font-medium">Transferencia</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-[9px] text-muted-foreground">Estado de Envío</p>
                            <p className="text-sm font-medium">
                                {order.status === 'ENTREGADO' ? 'Entregado' : 'En Camino'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Package className="h-3 w-3" />
                        Productos
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
                                    {orderProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-muted/30">
                                            <td className="p-2 sm:p-3 text-xs">{product.nombre}</td>
                                            <td className="p-2 sm:p-3 text-center text-xs">{product.cantidad}</td>
                                            <td className="p-2 sm:p-3 text-right text-xs">${product.precio.toFixed(2)}</td>
                                            <td className="p-2 sm:p-3 text-right text-xs font-medium">${product.subtotal.toFixed(2)}</td>
                                        </tr>
                                    ))}
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

                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        Dirección de Envío
                    </h3>
                    <div className="p-3 rounded-lg border bg-card">
                        <p className="text-sm">Almacén Principal</p>
                        <p className="text-xs text-muted-foreground mt-1">Av. Industrial 123, Lima</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 sticky bottom-0 bg-background py-2">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto gap-2"
                    >
                        <Printer className="h-4 w-4" />
                        Imprimir
                    </Button>
                    <Button
                        variant="default"
                        className="w-full sm:w-auto gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Descargar PDF
                    </Button>
                </div>

            </div>
        </Modal>
    );
};

export default ViewOrderdetailsModal;
