import React, { useState, useEffect } from 'react';
import Modal from '@/components/custom/modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Package, Pencil, TrendingUp, TrendingDown, Bell, History, Truck, DollarSign
} from 'lucide-react';

import useCrud from '@/hooks/useCrud';
import { useAuth } from '@/providers/UserContext';

const HistoryProductModal = ({ open, setOpen, product }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [movements, setMovements] = useState([]);

  const { getModel: getStockMovements } = useCrud('/api/v1/admin/stock_movements');
  const { getModel: getSpareParts } = useCrud('/api/v1/admin/spare_parts');

  const { user } = useAuth();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (open && product) {
      loadMovements();
    }
  }, [open, product]);

  const loadMovements = async () => {
    try {
      const [movementsResponse, sparePartsResponse] = await Promise.all([
        getStockMovements(),
        getSpareParts()
      ]);

      const allMovements = movementsResponse.data || (Array.isArray(movementsResponse) ? movementsResponse : []);
      const allSpareParts = sparePartsResponse.data || (Array.isArray(sparePartsResponse) ? sparePartsResponse : []);

      console.log('product completo:', product);
      console.log('_original:', product?._original);

      const productId = product?._original?.id;
      const sparePart = allSpareParts.find(sp => sp.product_id === productId);
      const sparePartId = sparePart?.id;

      console.log('productId:', productId);
      console.log('sparePart encontrado:', sparePart);
      console.log('spare_part_id a filtrar:', sparePartId);
      console.log('Todos los movimientos:', allMovements.length);

      const filteredMovements = allMovements.filter(m => m.spare_part_id === sparePartId);

      console.log('Movimientos filtrados:', filteredMovements.length);

      if (filteredMovements.length === 0) {
        console.warn('No se encontraron movimientos para spare_part_id:', sparePartId);
        console.log('Lista de spare_part_ids disponibles:', [...new Set(allMovements.map(m => m.spare_part_id))]);
      }

      const formattedMovements = filteredMovements.map(m => {
        const dateObj = new Date(m.created_at);
        const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

        return {
          date: formattedDate,
          type: m.movement_type === 'in' ? 'Entrada' : 'Salida',
          quantity: m.quantity,
          document: m.reference || '-',
          responsible: m.performed_by_id === user?.id ? 'Tú' : (m.performed_by_id?.substring(0, 8) || 'Sistema')
        };
      });

      formattedMovements.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMovements(formattedMovements);

    } catch (error) {
      console.error("Error al cargar los movimientos de stock:", error);
    }
  };

  const productDetails = {
    stockMin: 10,
    stockMax: 100,
    proveedor: "Suministros Industriales S.A.",
    precio: 45.50,
    ...product
  };

  if (!product) return null;

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
              <span className="truncate text-base sm:text-lg">Historial: {productDetails.desc || productDetails.name || productDetails.id}</span>
            </div>
          </div>
        }
        description={`ID: ${productDetails.id}`}
        callBack={() => setOpen(false)}
      >
        <div className="flex flex-col h-full max-h-[75vh] space-y-4 overflow-y-auto">
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
                  {movements.length > 0 ? (
                    movements.map((m, i) => (
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
                        <td className="p-2 sm:p-3 text-[9px] sm:text-[10px] text-muted-foreground hidden md:table-cell truncate max-w-[150px]" title={m.responsible}>
                          {m.responsible}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-xs text-muted-foreground">
                        No hay movimientos registrados para este producto.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HistoryProductModal;