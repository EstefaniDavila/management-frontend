import React, { useState } from 'react'
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
import GenerateDispatchModal from '@/composables/logisticsCoordinator/dispatch/modals/GenerateDispatchModal'
import DispatchHistoryModal from '@/composables/logisticsCoordinator/dispatch/modals/DispatchHistoryModal'

const initialPendingDispatch = [
  { id: 101, cliente: "Inversiones Arequipa S.A.", direccion: "Av. Ejercito 456, Cayma", bultos: 4, peso: "45kg", prioridad: "Alta" },
  { id: 102, cliente: "Taller Mecánico El Rayo", direccion: "Calle Mercaderes 123, Centro", bultos: 1, peso: "5kg", prioridad: "Normal" },
  { id: 103, cliente: "Minería Cerro Verde", direccion: "Asentamiento Minero S/N", bultos: 12, peso: "280kg", prioridad: "Urgente" },
];

const initialDispatchHistory = [
  { 
    id: 1, 
    guia: "GUID-1702345678901", 
    fecha: "2024-04-15 14:30", 
    ordenId: 98, 
    cliente: "Constructora Los Andes",
    direccion: "Av. La Marina 123, Lima",
    vehiculo: "ABC-123", 
    conductor: "Juan Pérez",
    estado: "Entregado",
    observaciones: "Mercadería frágil"
  },
  { 
    id: 2, 
    guia: "GUID-1702345678902", 
    fecha: "2024-04-14 10:15", 
    ordenId: 95, 
    cliente: "Corporación del Sur",
    direccion: "Calle Los Claveles 456, Arequipa",
    vehiculo: "XYZ-789", 
    conductor: "Carlos López",
    estado: "En Tránsito",
    observaciones: "Llamar antes de llegar"
  },
  { 
    id: 3, 
    guia: "GUID-1702345678903", 
    fecha: "2024-04-13 09:00", 
    ordenId: 92, 
    cliente: "Industrias del Norte",
    direccion: "Panamericana Norte Km 20",
    vehiculo: "MOTO-01", 
    conductor: "María Rodríguez",
    estado: "Entregado",
    observaciones: "Entregar en puerta trasera"
  },
];

const DispatchManagement = () => {
  const [pending, setPending] = useState(initialPendingDispatch);
  const [dispatchHistory, setDispatchHistory] = useState(initialDispatchHistory);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleAssign = (order) => {
    setSelectedOrder(order);
    setShowDispatchModal(true);
  };

  const handleConfirmDispatch = async (dispatchData) => {
    console.log('Despacho generado:', dispatchData);

    const newHistoryEntry = {
      id: dispatchHistory.length + 1,
      guia: dispatchData.guiaNumero,
      fecha: new Date().toLocaleString(),
      ordenId: selectedOrder.id,
      cliente: selectedOrder.cliente,
      direccion: selectedOrder.direccion,
      vehiculo: dispatchData.vehicleDetails?.placa,
      conductor: dispatchData.driverDetails?.nombre,
      estado: "En Tránsito",
      observaciones: dispatchData.observations || "Sin observaciones"
    };

    setDispatchHistory(prev => [newHistoryEntry, ...prev]);
    setPending(prev => prev.filter(item => item.id !== selectedOrder.id));

    alert(`Guía ${dispatchData.guiaNumero} generada exitosamente\n\nVehículo: ${dispatchData.vehicleDetails?.placa}\nConductor: ${dispatchData.driverDetails?.nombre}`);

    setShowDispatchModal(false);
    setSelectedOrder(null);
  };

  const orderDataForModal = selectedOrder ? {
    oc: `ORD-${selectedOrder.id}`,
    cliente: selectedOrder.cliente,
    productos: `${selectedOrder.bultos} bultos - ${selectedOrder.peso}`,
    direccion: selectedOrder.direccion,
    total: selectedOrder.peso === "280kg" ? "3,200.00" : selectedOrder.peso === "45kg" ? "850.00" : "120.00"
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
                  <CardTitle className="text-sm font-bold">Orden #{item.id}</CardTitle>
                  <Badge variant={item.prioridad === 'Urgente' ? 'destructive' : 'outline'}>
                    {item.prioridad}
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm font-semibold leading-none">{item.cliente}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span className="text-xs">{item.direccion}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg text-xs">
                    <div className="flex items-center gap-1">
                      <Package className="h-3.5 w-3.5" />
                      <span>{item.bultos} Bultos</span>
                    </div>
                    <div className="font-mono font-bold">
                      {item.peso}
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
      <GenerateDispatchModal
        open={showDispatchModal}
        setOpen={setShowDispatchModal}
        onConfirm={handleConfirmDispatch}
        orderData={orderDataForModal}
      />

      {/* Modal de Historial */}
      <DispatchHistoryModal
        open={showHistoryModal}
        setOpen={setShowHistoryModal}
        history={dispatchHistory}
      />
    </>
  )
}

export default DispatchManagement