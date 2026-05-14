import React, { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Truck,
  MapPin,
  Package,
  User,
  ChevronRight,
  ClipboardList,
  History,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

import AGenerateDispatchModal from '@/composables/admin/logistics/disptachs/AGenerateDispatchModal'
import ADispatchHistoryModal from '@/composables/admin/logistics/disptachs/ADispatchHistoryModal'
import useCrud from '@/hooks/useCrud'

const DispatchManagement = () => {
  const [pending, setPending] = useState([]);
  const [dispatchHistory, setDispatchHistory] = useState([]);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { getModel } = useCrud('/api/v1/admin/dispatch_orders');

  const fetchDispatches = async () => {
    try {
      const response = await getModel();
      const data = response.data || (Array.isArray(response) ? response : []);

      const pendingOrders = [];
      const historyOrders = [];

      data.forEach(item => {
        const estadoLabel = item.status === 'delivered' ? 'Entregado' :
          item.status === 'in_transit' ? 'En Tránsito' : 'Pendiente';

        const mappedItem = {
          id: item.id,
          code: item.code,
          status: item.status,
          fecha: new Date(item.created_at).toLocaleString(),
          ordenId: item.sales_order_id || item.rental_id || 'N/A',
          estado: estadoLabel,
          prepared_by_id: item.prepared_by_id,
          dispatched_at: item.dispatched_at ? new Date(item.dispatched_at).toLocaleString() : 'N/A',
          delivered_at: item.delivered_at ? new Date(item.delivered_at).toLocaleString() : 'N/A',
          _original: item
        };

        if (item.status === 'pending' || !item.status) {
          pendingOrders.push(mappedItem);
        } else {
          historyOrders.push(mappedItem);
        }
      });

      setPending(pendingOrders);
      setDispatchHistory(historyOrders);

    } catch (error) {
      console.error("Error al cargar despachos:", error);
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, []);

  const handleAssign = (order) => {
    setSelectedOrder(order);
    setShowDispatchModal(true);
  };

  const handleConfirmDispatch = async (dispatchData) => {
    console.log('Despacho generado:', dispatchData);
    setShowDispatchModal(false);
    setSelectedOrder(null);
    fetchDispatches();
  };

  const orderDataForModal = selectedOrder ? {
    id: selectedOrder.id,
    oc: selectedOrder.code,
    ordenAsociada: selectedOrder.ordenId,
    fecha: selectedOrder.fecha
  } : null;

  const totalEntregados = dispatchHistory.filter(h => h.estado === "Entregado").length;
  const totalEnTransito = dispatchHistory.filter(h => h.estado === "En Tránsito").length;

  return (
    <>
      <div className="p-4 md:p-6 w-full min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                DESPACHOS PENDIENTES
              </h1>
              <p className="text-muted-foreground text-sm">
                Ventas con servicio de delivery esperando asignación de transporte.
              </p>
            </div>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowHistoryModal(true)}
            >
              <History className="h-4 w-4" />
              Ver Historial
              <Badge variant="secondary" className="ml-1">
                {dispatchHistory.length}
              </Badge>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold">{pending.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">En Tránsito</p>
                  <p className="text-2xl font-bold">{totalEnTransito}</p>
                </div>
                <Truck className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Entregados</p>
                  <p className="text-2xl font-bold">{totalEntregados}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((item) => (
              <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-bold">{item.code}</CardTitle>
                  <Badge variant="outline">
                    Pendiente
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm font-semibold leading-none text-wrap break-all">Orden: {item.ordenId}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 mt-0.5" />
                      <span className="text-xs">Creado: {item.fecha}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full gap-2 group"
                    variant="default"
                    onClick={() => handleAssign(item)}
                  >
                    <ClipboardList className="h-4 w-4" />
                    Asignar Conductor
                    <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}

            {pending.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl bg-white dark:bg-slate-900">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Truck className="h-10 w-10 opacity-20" />
                  <p>No hay despachos pendientes por el momento.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Generar Despacho */}
      <AGenerateDispatchModal
        open={showDispatchModal}
        setOpen={setShowDispatchModal}
        //onConfirm={handleConfirmDispatch}
        orderData={orderDataForModal}
      />

      {/* Modal de Historial */}
      <ADispatchHistoryModal
        open={showHistoryModal}
        setOpen={setShowHistoryModal}
        history={dispatchHistory}
      />
    </>
  )
}

export default DispatchManagement;