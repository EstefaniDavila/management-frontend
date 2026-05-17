import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
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

  const handleDownloadGuide = async (order) => {
    console.log('1. order recibido:', order);
    console.log('2. order.id:', order.id);

    try {
      const url = `/api/v1/admin/purchase_orders/${order.id}/download_guide`;
      console.log('3. URL:', url);

      const response = await fetch(url, { credentials: 'include' });
      console.log('4. response.status:', response.status);
      console.log('5. response.ok:', response.ok);
      console.log('6. content-type:', response.headers.get('content-type'));

      const text = await response.text(); // 👈 text primero, no json
      console.log('7. respuesta raw:', text.substring(0, 200));

      if (!response.ok) throw new Error(`Error ${response.status}: ${text}`);

      const data = JSON.parse(text);
      console.log('8. data OK:', data);

      const doc = new jsPDF();

      const primaryColor = [30, 64, 175];   // azul
      const grayDark = [30, 30, 30];
      const grayMid = [100, 100, 100];
      const grayLight = [240, 240, 240];

      const pageW = doc.internal.pageSize.getWidth();
      let y = 0;

      // ── Header ──────────────────────────────────────────────
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageW, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('GUÍA DE RECEPCIÓN', 14, 13);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Código: ${data.code}`, 14, 21);
      doc.text(
        `Generado: ${new Date(data.generated_at).toLocaleString('es-ES')}`,
        14, 27
      );

      // Estado (badge derecha)
      const statusLabel = {
        draft: 'PENDIENTE', completed: 'ENTREGADO',
        cancelled: 'CANCELADO', in_transit: 'EN TRÁNSITO'
      }[data.status] ?? data.status.toUpperCase();

      const statusColor = {
        ENTREGADO: [34, 197, 94], PENDIENTE: [234, 179, 8],
        CANCELADO: [239, 68, 68], 'EN TRÁNSITO': [59, 130, 246]
      }[statusLabel] ?? [100, 100, 100];

      doc.setFillColor(...statusColor);
      doc.roundedRect(pageW - 50, 10, 36, 12, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(statusLabel, pageW - 32, 18, { align: 'center' });

      y = 42;

      // ── Sección Proveedor ────────────────────────────────────
      const drawSection = (title, startY) => {
        doc.setFillColor(...grayLight);
        doc.rect(14, startY, pageW - 28, 7, 'F');
        doc.setTextColor(...primaryColor);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 17, startY + 5);
        return startY + 12;
      };

      const drawRow = (label, value, rowY, col = 0) => {
        const x = 14 + col * 90;
        doc.setTextColor(...grayMid);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text(label.toUpperCase(), x, rowY);
        doc.setTextColor(...grayDark);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(String(value ?? '—'), x, rowY + 5);
      };

      y = drawSection('DATOS DEL PROVEEDOR', y);
      const s = data.supplier;
      drawRow('Razón Social', s.business_name, y, 0);
      drawRow('RUC / Doc.', s.document_number, y, 1);
      y += 14;
      drawRow('Teléfono', s.phone, y, 0);
      drawRow('Email', s.email, y, 1);
      y += 14;
      drawRow('Dirección', s.address, y, 0);
      y += 16;

      // ── Sección Orden ────────────────────────────────────────
      y = drawSection('DATOS DE LA ORDEN', y);
      drawRow('Fecha esperada', data.expected_date ?? '—', y, 0);
      drawRow('Fecha recepción', data.received_at
        ? new Date(data.received_at).toLocaleDateString('es-ES') : '—', y, 1);
      y += 14;
      if (data.notes) {
        drawRow('Notas', data.notes, y, 0);
        y += 14;
      }
      y += 2;

      // ── Tabla de Items ───────────────────────────────────────
      y = drawSection('DETALLE DE PRODUCTOS', y);

      // Cabecera tabla
      const cols = [
        { label: 'CÓD. PRODUCTO', x: 14, w: 38 },
        { label: 'PRODUCTO', x: 54, w: 70 },
        { label: 'CANT.', x: 126, w: 18 },
        { label: 'P. UNIT.', x: 146, w: 24 },
        { label: 'SUBTOTAL', x: 172, w: 28 },
      ];

      doc.setFillColor(...primaryColor);
      doc.rect(14, y, pageW - 28, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      cols.forEach(c => doc.text(c.label, c.x + 2, y + 5.5));
      y += 8;

      // Filas
      data.items.forEach((item, i) => {
        const bg = i % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
        doc.setFillColor(...bg);
        doc.rect(14, y, pageW - 28, 8, 'F');
        doc.setTextColor(...grayDark);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');

        doc.text(item.product_code ?? '—', cols[0].x + 2, y + 5.5);
        doc.text(
          doc.splitTextToSize(item.product_name, cols[1].w - 4)[0],
          cols[1].x + 2, y + 5.5
        );
        doc.text(String(item.quantity), cols[2].x + 2, y + 5.5);
        doc.text(`S/ ${Number(item.unit_cost).toFixed(2)}`, cols[3].x + 2, y + 5.5);
        doc.text(`S/ ${Number(item.subtotal).toFixed(2)}`, cols[4].x + 2, y + 5.5);

        y += 8;
      });

      // Borde tabla
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.3);
      doc.rect(14, y - (data.items.length * 8) - 8, pageW - 28, data.items.length * 8 + 8);
      y += 4;

      // ── Total ────────────────────────────────────────────────
      doc.setFillColor(...primaryColor);
      doc.roundedRect(pageW - 60, y, 46, 12, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL:', pageW - 57, y + 8);
      doc.text(`S/ ${Number(data.total).toFixed(2)}`, pageW - 16, y + 8, { align: 'right' });
      y += 20;

      // ── Footer ───────────────────────────────────────────────
      doc.setDrawColor(...grayLight);
      doc.setLineWidth(0.5);
      doc.line(14, y, pageW - 14, y);
      doc.setTextColor(...grayMid);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.text(
        'Documento generado automáticamente — Sistema de Gestión de Pedidos',
        pageW / 2, y + 6, { align: 'center' }
      );

      doc.save(`guia_recepcion_${data.code}.pdf`);

    } catch (error) {
      console.error('Error al descargar:', error);
      alert(`Error al descargar la guía: ${error.message}`);
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
              handleDeleteOrder={handleDeleteOrder}
              handleReceiveOrder={handleReceiveOrder}
              handleCancelOrder={handleCancelOrder}
              handleDownloadGuide={handleDownloadGuide}
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