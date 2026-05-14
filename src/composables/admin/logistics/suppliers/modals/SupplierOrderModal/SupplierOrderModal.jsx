import React, { useState, useEffect } from 'react';
import Modal from '@/components/custom/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Calendar,
  DollarSign,
  FileText,
  Eye
} from 'lucide-react';
import ViewOrderDetailModal from './ViewOrderDetailModal/ViewOrderDetailModal';
import useCrud from '@/hooks/useCrud';

const SupplierOrderModal = ({ open, setOpen, supplier }) => {
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getModel } = useCrud('/api/v1/admin/purchase_orders');
  const { getModel: getItems } = useCrud('');

  useEffect(() => {
    if (open && supplier?.id) {
      fetchPurchaseHistory();
    }
  }, [open, supplier?.id]);

  const fetchPurchaseHistory = async () => {
    setLoading(true);
    try {
      const response = await getModel();
      const allOrders = response.data || (Array.isArray(response) ? response : []);
      const supplierOrders = allOrders.filter(order => order.supplier_id === supplier.id);

      const formattedOrders = supplierOrders.map(order => ({
        ...order,
        fecha: order.created_at?.split('T')[0] || order.expected_date,
      }));

      setPurchaseHistory(formattedOrders);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      setPurchaseHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order) => {
    setLoading(true);
    try {
      const itemsResponse = await getItems(`/api/v1/admin/purchase_orders/${order.id}/items`);
      const items = itemsResponse.data || (Array.isArray(itemsResponse) ? itemsResponse : []);

      // ✅ Enviar la orden COMPLETA con sus items
      const orderWithDetails = {
        ...order,
        items: items,
      };

      setSelectedOrder(orderWithDetails);
      setShowOrderDetail(true);
    } catch (error) {
      console.error("Error fetching order items:", error);
      setSelectedOrder(order);
      setShowOrderDetail(true);
    } finally {
      setLoading(false);
    }
  };

  const totalInversion = purchaseHistory.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
  const ultimaCompra = purchaseHistory[0]?.fecha || "N/A";

  if (!supplier) return null;

  if (loading && purchaseHistory.length === 0) {
    return (
      <Modal open={open} setOpen={setOpen} title="Cargando...">
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="text-sm sm:text-base truncate">Historial de Compras: {supplier.nombre}</span>
          </div>
        }
        description={`RUC: ${supplier.ruc} | Total de compras: ${purchaseHistory.length}`}
        size="lg"
        callBack={() => setOpen(false)}
      >
        <div className="flex flex-col gap-4 sm:gap-6 py-2 h-full max-h-[75vh] overflow-y-auto">
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border bg-card shadow-sm flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] uppercase text-muted-foreground font-bold">Total Órdenes</p>
                <p className="text-base sm:text-lg font-bold">{purchaseHistory.length}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-card shadow-sm flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] uppercase text-muted-foreground font-bold">Inversión Total</p>
                <p className="text-base sm:text-lg font-bold">${totalInversion.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-card shadow-sm flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] uppercase text-muted-foreground font-bold">Última Compra</p>
                <p className="text-xs sm:text-sm font-bold">{ultimaCompra}</p>
              </div>
            </div>
          </div>

          {/* Tabla de órdenes */}
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            <h3 className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Detalle de Documentos
            </h3>

            <div className="border rounded-lg overflow-hidden bg-card shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px] sm:min-w-[600px]">
                  <thead className="bg-muted/50 border-b sticky top-0">
                    <tr>
                      <th className="p-2 sm:p-3 text-left font-semibold text-[9px] sm:text-[11px]">FECHA</th>
                      <th className="p-2 sm:p-3 text-left font-semibold text-[9px] sm:text-[11px]">ORDEN (OC)</th>
                      <th className="p-2 sm:p-3 text-right font-semibold text-[9px] sm:text-[11px]">MONTO</th>
                      <th className="p-2 sm:p-3 text-center font-semibold text-[9px] sm:text-[11px] hidden sm:table-cell">ESTADO</th>
                      <th className="p-2 sm:p-3 text-right font-semibold text-[9px] sm:text-[11px]">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {purchaseHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-2 sm:p-3 text-[9px] sm:text-[11px] font-mono whitespace-nowrap">{item.fecha}</td>
                        <td className="p-2 sm:p-3 font-medium text-[10px] sm:text-xs">{item.code}</td>
                        <td className="p-2 sm:p-3 text-right font-bold text-[10px] sm:text-xs">${parseFloat(item.total).toFixed(2)}</td>
                        <td className="p-2 sm:p-3 text-center hidden sm:table-cell">
                          <Badge
                            variant="outline"
                            className={`text-[8px] sm:text-[10px] h-5 px-1 sm:px-2 ${item.status === 'completed'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : item.status === 'draft'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                          >
                            {item.status === 'completed' ? 'Completado' :
                              item.status === 'draft' ? 'Pendiente' :
                                item.status === 'sent' ? 'Enviado' : item.status}
                          </Badge>
                        </td>
                        <td className="p-2 sm:p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(item)}
                            className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-[11px] gap-1"
                            disabled={loading}
                          >
                            <Eye className="h-3 w-3" />
                            <span className="hidden xs:inline">Ver</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {purchaseHistory.length === 0 && !loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay compras registradas para este proveedor
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <ViewOrderDetailModal
        open={showOrderDetail}
        setOpen={setShowOrderDetail}
        order={selectedOrder}
        supplier={supplier}
      />
    </>
  );
};

export default SupplierOrderModal;