import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import OrdersSuppliersTable from '@/composables/admin/logistics/ordersSuppliers/Table/OrdersSuppliersTable';
import ViewOrderDetailModal from '@/composables/admin/logistics/suppliers/modals/SupplierOrderModal/ViewOrderDetailModal/ViewOrderDetailModal';


const fakePurchaseOrders = {
  rows: [
    { 
      orderId: "PO-2024-001", 
      proveedor: "Maquinarias S.A.", 
      fechaPedido: "2024-01-15", 
      fechaEntrega: "2024-01-22", 
      totalProductos: 15, 
      montoTotal: 12500000, 
      status: "ENTREGADO" 
    },
    { 
      orderId: "PO-2024-002", 
      proveedor: "Repuestos Industriales Ltda.", 
      fechaPedido: "2024-01-20", 
      fechaEntrega: null, 
      totalProductos: 45, 
      montoTotal: 3450000, 
      status: "PENDIENTE" 
    },
    { 
      orderId: "PO-2024-003", 
      proveedor: "Equipos Pesados SpA", 
      fechaPedido: "2024-01-25", 
      fechaEntrega: "2024-02-01", 
      totalProductos: 8, 
      montoTotal: 8900000, 
      status: "EN_TRANSITO" 
    },
    { 
      orderId: "PO-2024-004", 
      proveedor: "Insumos Mineros", 
      fechaPedido: "2024-01-28", 
      fechaEntrega: null, 
      totalProductos: 120, 
      montoTotal: 6700000, 
      status: "CANCELADO" 
    },
    { 
      orderId: "PO-2024-005", 
      proveedor: "Logística Express", 
      fechaPedido: "2024-02-01", 
      fechaEntrega: "2024-02-08", 
      totalProductos: 32, 
      montoTotal: 2100000, 
      status: "ENTREGADO" 
    },
  ],
  rowCount: 47
};

const PurchaseOrderHistory = () => {
  const [orders, setOrders] = useState(fakePurchaseOrders.rows);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [searchFields, setSearchFields] = useState(["orderId", "proveedor"]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterProveedor, setFilterProveedor] = useState("todos");
  const [typeModal, setTypeModal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const refetchData = () => console.log("Refetching orders data...");

  const handleOpenModal = (type, order = null) => {
    setTypeModal(type);
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setTypeModal("");
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleSaveOrder = async (newOrder) => {
    try {
      console.log("Guardando pedido:", newOrder);

      const orderToAdd = {
        orderId: newOrder.orderId,
        proveedor: newOrder.proveedor,
        fechaPedido: newOrder.fechaPedido,
        fechaEntrega: newOrder.fechaEntrega || null,
        totalProductos: parseInt(newOrder.totalProductos),
        montoTotal: parseFloat(newOrder.montoTotal),
        status: newOrder.status
      };

      setOrders(prev => [orderToAdd, ...prev]);
      handleCloseModal();
      alert("Pedido creado exitosamente");

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al crear el pedido");
    }
  };

  const handleUpdateOrder = async (updatedData) => {
    try {
      console.log("Datos actualizados:", updatedData);

      const updatedOrder = {
        orderId: updatedData.orderId,
        proveedor: updatedData.proveedor,
        fechaPedido: updatedData.fechaPedido,
        fechaEntrega: updatedData.fechaEntrega || null,
        totalProductos: parseInt(updatedData.totalProductos),
        montoTotal: parseFloat(updatedData.montoTotal),
        status: updatedData.status
      };

      setOrders(prev =>
        prev.map(o => o.orderId === selectedOrder.orderId ? updatedOrder : o)
      );

      handleCloseModal();
      alert("Pedido actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el pedido");
    }
  };

  const handleDeleteOrder = async (order) => {
    try {
      console.log("Anulando pedido:", order);
      setOrders(prev => prev.filter(o => o.orderId !== order.orderId));
      handleCloseModal();
      alert("Pedido anulado exitosamente");
    } catch (error) {
      console.error("Error al anular:", error);
      alert("Error al anular el pedido");
    }
  };

  const proveedoresUnicos = [...new Set(orders.map(o => o.proveedor))];

  const filteredData = orders.filter(item => {
    const matchStatus = filterStatus === "todos" || item.status.toLowerCase() === filterStatus.toLowerCase();
    const matchProveedor = filterProveedor === "todos" || item.proveedor === filterProveedor;
    return matchStatus && matchProveedor;
  });

  const totalPages = Math.ceil(filteredData.length / pagination.pageSize);

  return (
    <div className="px-4 py-4 md:px-6 w-full">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-4">

        <h1 className="text-base font-semibold tracking-tight text-foreground">
          Historial de Pedidos a Proveedores
        </h1>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-3.5 w-3.5" />
                Estado: {filterStatus === "todos" ? "Todos" : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("todos")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("ENTREGADO")}>Entregado</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("PENDIENTE")}>Pendiente</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("EN_TRANSITO")}>En Tránsito</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("CANCELADO")}>Cancelado</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-3.5 w-3.5" />
                Proveedor: {filterProveedor === "todos" ? "Todos" : filterProveedor.split(' ')[0]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-64 overflow-y-auto">
              <DropdownMenuItem onClick={() => setFilterProveedor("todos")}>Todos</DropdownMenuItem>
              {proveedoresUnicos.map(prov => (
                <DropdownMenuItem key={prov} onClick={() => setFilterProveedor(prov)}>
                  {prov}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            onClick={() => handleOpenModal('create')}
            className="ml-auto"
          >
            + Nuevo Pedido
          </Button>
        </div>

        <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle p-4"></div>
            <OrdersSuppliersTable
              data={filteredData}
              fetchData={refetchData}
              pagination={pagination}
              setPagination={setPagination}
              totalPages={totalPages}
              search={search}
              setSearch={setSearch}
              searchFields={searchFields}
              setSearchFields={setSearchFields}
              handleOpenModal={handleOpenModal}
            />
          </div>
        </div>

      </div>

      {typeModal === 'create' && (
        <CreateOrderModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          onSave={handleSaveOrder}
        />
      )}

      {typeModal === 'edit' && (
        <UpdateOrderModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          orderToEdit={selectedOrder}
          onSave={handleUpdateOrder}
        />
      )}

      {typeModal === 'delete' && (
        <DeleteOrderModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          order={selectedOrder}
          onConfirm={handleDeleteOrder}
        />
      )}

      {typeModal === 'details' && (
        <ViewOrderDetailModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          order={selectedOrder}
          
        />
      )}

    </div>
  );
};

export default PurchaseOrderHistory;