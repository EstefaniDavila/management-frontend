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
import CreateNewOrderModal from '@/composables/admin/logistics/ordersSuppliers/modals/CreateNewOrderModal';
import ViewOrderDetailModal from '@/composables/admin/logistics/ordersSuppliers/modals/ViewOrderdetailsModal';
import useCrud from '@/hooks/useCrud';
import useEntityMutation from '@/hooks/useEntityMutation';
import UpdateOrderModal from '@/composables/admin/logistics/ordersSuppliers/modals/UpdateOrderModal';
import DeleteOrderModal from '@/composables/admin/logistics/ordersSuppliers/modals/DeleteOrderModal';

const PurchaseOrderHistory = () => {
  const { getModel: getOrders } = useCrud('/api/v1/admin/purchase_orders');
  const { getModel: getSuppliers } = useCrud('/api/v1/admin/suppliers');
  const orderMutation = useEntityMutation({ entityName: 'purchase_order' });

  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [searchFields, setSearchFields] = useState(["orderId", "proveedor"]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterProveedor, setFilterProveedor] = useState("todos");
  const [typeModal, setTypeModal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [ordersData, suppliersData] = await Promise.all([
        getOrders(),
        getSuppliers()
      ]);

      const formattedOrders = ordersData.map(order => {
        const supplier = suppliersData.find(s => s.id === order.supplier_id);
        const statusMap = {
          'draft': 'PENDIENTE',
          'completed': 'ENTREGADO',
          'cancelled': 'CANCELADO',
          'in_transit': 'EN_TRANSITO'
        };

        return {
          id: order.id,
          orderId: order.code,
          proveedor: supplier ? supplier.business_name : 'Desconocido',
          supplier_id: order.supplier_id,
          fechaPedido: order.created_at,
          fechaEntrega: order.expected_date,
          fechaAceptada: order.received_at,
          montoTotal: parseFloat(order.total) || 0,
          status: statusMap[order.status] || order.status,
          _original: order
        };
      });

      setOrders(formattedOrders);
      setSuppliers(suppliersData.map(s => ({
        id: s.id,
        nombre: s.business_name,
        _original: s
      })));
    } catch (error) {
      console.error("Error cargando los datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInitialData();
  }, []);

  const refetchData = () => fetchInitialData();

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

  const handleSaveOrder = (pedidoData) => {
    orderMutation.mutate(
      { action: 'create', entity: pedidoData, endpoint: '/api/v1/admin/purchase_orders' },
      {
        onSuccess: () => {
          refetchData();
          handleCloseModal();
        }
      }
    );
  };

  const handleUpdateOrder = (updatedData) => {
    orderMutation.mutate(
      {
        action: 'update',
        entity: updatedData,
        endpoint: `/api/v1/admin/purchase_orders/${updatedData.get ? updatedData.get('id') : updatedData.id}`,
        id: updatedData.get ? updatedData.get('id') : updatedData.id
      },
      {
        onSuccess: () => {
          refetchData();
          handleCloseModal();
        }
      }
    );
  };

  const handleDeleteOrder = (order) => {
    orderMutation.mutate(
      {
        action: 'delete',
        endpoint: `/api/v1/admin/purchase_orders/${order.id}`,
        id: order.id
      },
      {
        onSuccess: () => {
          refetchData();
          handleCloseModal();
        }
      }
    );
  };

  const handleReceiveOrder = (order) => {
    if (!window.confirm("¿Estás seguro de marcar esta orden como recibida/entregada?")) return;

    orderMutation.mutate(
      {
        action: 'update',
        entity: {},
        endpoint: `/api/v1/admin/purchase_orders/${order.id}/receive`,
        id: order.id
      },
      {
        onSuccess: () => {
          refetchData();
        }
      }
    );
  };

  const handleCancelOrder = (order) => {
    orderMutation.mutate(
      {
        action: 'update',
        entity: {},
        endpoint: `/api/v1/admin/purchase_orders/${order.id}/cancel`,
        id: order.id
      },
      {
        onSuccess: () => {
          refetchData();
        }
      }
    );
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
              handleReceiveOrder={handleReceiveOrder}
              handleCancelOrder={handleCancelOrder}
            />
          </div>
        </div>

      </div>

      {typeModal === 'create' && (
        <CreateNewOrderModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          onSave={handleSaveOrder}
          suppliers={suppliers}
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

      {typeModal === 'details' && selectedOrder && (
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