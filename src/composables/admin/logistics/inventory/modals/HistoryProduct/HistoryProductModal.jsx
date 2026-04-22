import React, { useState, useEffect } from 'react';
import Modal from '@/components/custom/modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package, Pencil, TrendingUp, TrendingDown, Bell, History, Truck, DollarSign
} from 'lucide-react';
import AlertStockModal from './AlertStockModal/AlertStockModal';

const HistoryProductModal = ({ open, setOpen, product }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile(); // Ejecutar al montar
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const productDetails = {
    stockMin: 10,
    stockMax: 100,
    proveedor: "Suministros Industriales S.A.",
    precio: 45.50,
    ...product
  };

  if (!product) return null;

  const movements = [
    { date: "2024-04-16 14:30", type: "Salida", quantity: 3, document: "Pedido P001", responsible: "Juan Pérez" },
    { date: "2024-04-15 09:15", type: "Entrada", quantity: 50, document: "OC-001", responsible: "Carlos López" },
  ];

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        size={isMobile ? "lg" : "xl"}
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 pr-8">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="truncate text-base sm:text-lg">Historial: {productDetails.desc}</span>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => setIsEditing(!isEditing)}
              className="w-full sm:w-auto h-8 text-xs gap-1"
            >
              <Pencil className="h-3 w-3" />
              {isEditing ? "Cancelar" : "Editar Info"}
            </Button>
          </div>
        }
        description={`ID: ${productDetails.id}`}
        callBack={() => setOpen(false)}
      >
        <div className="flex flex-col h-full max-h-[75vh] space-y-4 overflow-y-auto">


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-muted/30 p-3 sm:p-4 rounded-xl border shadow-sm">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                Existencias
              </Label>
              <div className="space-y-1">
                {isEditing ? (
                  <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1">
                    <Input type="number" placeholder="Min" defaultValue={productDetails.stockMin} className="h-8 px-1 text-xs" />
                    <Input type="number" placeholder="Actual" defaultValue={productDetails.stock} className="h-8 px-1 text-xs border-primary" />
                    <Input type="number" placeholder="Max" defaultValue={productDetails.stockMax} className="h-8 px-1 text-xs" />
                  </div>
                ) : (
                  <div>
                    <p className="text-xl sm:text-2xl font-bold leading-none">{productDetails.stock}</p>
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground italic block mt-1">
                      Mín: {productDetails.stockMin} / Máx: {productDetails.stockMax}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Logística</Label>
              <div className="space-y-1">
                {isEditing ? (
                  <Input defaultValue={productDetails.loc} className="h-8 text-xs" />
                ) : (
                  <>
                    <p className="text-xs sm:text-sm font-medium flex items-center gap-1 truncate">
                      📍 {productDetails.loc}
                    </p>
                    <Badge className="text-[10px] h-5 bg-green-500/10 text-green-600 border-green-200">
                      Operativo
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Truck className="h-3 w-3" /> Proveedor
              </Label>
              <div className="space-y-1">
                {isEditing ? (
                  <Input defaultValue={productDetails.proveedor} className="h-8 text-xs" />
                ) : (
                  <>
                    <p className="text-xs sm:text-sm font-medium truncate">{productDetails.proveedor}</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground">Última entrega: 15/04/24</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Valor
              </Label>
              <div className="space-y-1">
                {isEditing ? (
                  <Input type="number" step="0.01" defaultValue={productDetails.precio} className="h-8 text-xs" />
                ) : (
                  <p className="text-lg sm:text-xl font-bold text-primary">
                    ${productDetails.precio?.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col gap-3">
            <h3 className="text-xs font-bold flex items-center gap-1 text-muted-foreground uppercase tracking-widest">
              <History className="h-3 w-3" /> Registro de Movimientos
            </h3>

            <div className="relative rounded-lg border shadow-inner overflow-x-auto bg-card">
              <table className="w-full text-sm min-w-[500px] sm:min-w-[600px]">
                <thead className="bg-muted/50 sticky top-0 border-b">
                  <tr>
                    <th className="text-left p-2 sm:p-3 text-[10px] sm:text-[11px] font-bold">FECHA</th>
                    <th className="text-left p-2 sm:p-3 text-[10px] sm:text-[11px] font-bold">TIPO</th>
                    <th className="text-right p-2 sm:p-3 text-[10px] sm:text-[11px] font-bold">CANT.</th>
                    <th className="text-left p-2 sm:p-3 text-[10px] sm:text-[11px] font-bold hidden sm:table-cell">DOCUMENTO</th>
                    <th className="text-left p-2 sm:p-3 text-[10px] sm:text-[11px] font-bold hidden md:table-cell">RESPONSABLE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {movements.map((m, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors group">
                      <td className="p-2 sm:p-3 text-[9px] sm:text-[10px] font-mono whitespace-nowrap text-muted-foreground">{m.date}</td>
                      <td className="p-2 sm:p-3">
                        <div className="flex items-center gap-1 sm:gap-2">
                          {m.type === "Entrada" ?
                            <TrendingUp className="h-3 w-3 text-emerald-500" /> :
                            <TrendingDown className="h-3 w-3 text-rose-500" />
                          }
                          <span className={`text-[10px] sm:text-xs font-medium ${m.type === "Entrada" ? "text-emerald-600" : "text-rose-600"}`}>
                            {m.type}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 text-right font-bold text-[10px] sm:text-xs">{m.quantity}</td>
                      <td className="p-2 sm:p-3 text-[9px] sm:text-[10px] font-medium hidden sm:table-cell">{m.document}</td>
                      <td className="p-2 sm:p-3 text-[9px] sm:text-[10px] text-muted-foreground hidden md:table-cell">{m.responsible}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-2 sticky bottom-0 bg-background py-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto gap-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 h-9 text-xs font-semibold"
              onClick={() => setShowAlertModal(true)}
            >
              <Bell className="h-3 w-3" /> Gestionar Alertas de Stock Bajo
            </Button>
          </div>
        </div>
      </Modal>

      <AlertStockModal
        open={showAlertModal}
        setOpen={setShowAlertModal}
        productName={productDetails.desc}
      />
    </>
  );
};

export default HistoryProductModal;