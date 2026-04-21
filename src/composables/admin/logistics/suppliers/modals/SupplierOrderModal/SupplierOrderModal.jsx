import React, { useState } from 'react';
import Modal from '@/components/custom/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Calendar, 
  DollarSign, 
  FileText, 
  ArrowUpRight,
  Eye
} from 'lucide-react';
import ViewOrderDetailModal from './ViewOrderDetailModal/ViewOrderDetailModal';

const SupplierOrderModal = ({ open, setOpen, supplier }) => {
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!supplier) return null;

  const purchaseHistory = [
    { id: 1, fecha: "2024-04-10", oc: "OC-8823", monto: 1250.00, estado: "Completado", productos: 5, metodo: "Transferencia" },
    { id: 2, fecha: "2024-03-25", oc: "OC-8710", monto: 450.50, estado: "En Tránsito", productos: 2, metodo: "Tarjeta" },
    { id: 3, fecha: "2024-02-15", oc: "OC-8500", monto: 3200.00, estado: "Completado", productos: 8, metodo: "Transferencia" },
  ];

  const totalInversion = purchaseHistory.reduce((sum, item) => sum + item.monto, 0);
  const ultimaCompra = purchaseHistory[0]?.fecha || "N/A";

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

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
        description={`RUC: ${supplier.ruc}`}
        size="lg"
        callBack={() => setOpen(false)}
      >
        <div className="flex flex-col gap-4 sm:gap-6 py-2 h-full max-h-[75vh] overflow-y-auto">

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
                        <td className="p-2 sm:p-3 font-medium text-[10px] sm:text-xs">{item.oc}</td>
                        <td className="p-2 sm:p-3 text-right font-bold text-[10px] sm:text-xs">${item.monto.toFixed(2)}</td>
                        <td className="p-2 sm:p-3 text-center hidden sm:table-cell">
                          <Badge 
                            variant="outline" 
                            className={`text-[8px] sm:text-[10px] h-5 px-1 sm:px-2 ${
                              item.estado === 'Completado' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {item.estado}
                          </Badge>
                        </td>
                        <td className="p-2 sm:p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(item)}
                            className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-[11px] gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span className="hidden xs:inline">Ver</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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