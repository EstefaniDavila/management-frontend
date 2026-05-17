import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, PackageCheck } from 'lucide-react';
import { jsPDF } from 'jspdf';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import OrdersTable from '@/composables/logisticsCoordinator/orders/table/OrdersTable';
import ViewOrderDetailsModal from '@/composables/admin/logistics/ordersSuppliers/modals/ViewOrderdetailsModal';
import useCrud from '@/hooks/useCrud';

const LogisticOrders = () => {
  const { getModel: getOrders } = useCrud('/api/v1/logistic_user/purchase_orders');
  const { getModel: getSuppliers } = useCrud('/api/v1/warehouse/suppliers');

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [searchFields] = useState(["orderId", "proveedor"]);
  const [filterProveedor, setFilterProveedor] = useState("todos");
  const [typeModal, setTypeModal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const [ordersResponse, suppliersResponse] = await Promise.all([
        getOrders(),
        getSuppliers().catch(() => [])
      ]);

      const fetchedOrders = Array.isArray(ordersResponse) ? ordersResponse : (ordersResponse?.data || []);
      const fetchedSuppliers = Array.isArray(suppliersResponse) ? suppliersResponse : (suppliersResponse?.data || []);

      const supplierMap = fetchedSuppliers.reduce((acc, supplier) => {
        acc[supplier.id] = supplier.business_name || supplier.name;
        return acc;
      }, {});

      const mappedOrders = fetchedOrders.map(item => ({
        id: item.id,
        orderId: item.code,
        proveedor: item.supplier?.business_name || supplierMap[item.supplier_id] || "Desconocido",
        fechaPedido: item.created_at,
        fechaEntrega: item.expected_date,
        fechaAceptada: item.received_at,
        notas: item.notes || "Sin nota",
        montoTotal: parseFloat(item.total || 0),
        status: item.status === 'completed' ? 'ENTREGADO' :
          item.status === 'cancelled' ? 'CANCELADO' :
            item.status === 'sent' ? 'EN_TRANSITO' : 'PENDIENTE',
        _original: item,
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleOpenModal = (type, order) => {
    if (type === 'details') {
      setTypeModal(type);
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setTypeModal("");
    setSelectedOrder(null);
    setIsModalOpen(false);
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

      const text = await response.text();
      console.log('7. respuesta raw:', text.substring(0, 200));

      if (!response.ok) throw new Error(`Error ${response.status}: ${text}`);

      const data = JSON.parse(text);
      console.log('8. data OK:', data);

      const doc = new jsPDF();

      const primaryColor = [30, 64, 175];
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

      // Estado 
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

  const pendientes = orders.filter(o => o.status === "PENDIENTE" || o.status === "EN_TRANSITO").length;

  const filteredData = useMemo(() => {
    return filterProveedor === "todos" ? orders : orders.filter(o => o.proveedor === filterProveedor);
  }, [orders, filterProveedor]);

  const proveedoresUnicos = [...new Set(orders.map(o => o.proveedor))].filter(Boolean);
  const totalPages = Math.ceil(filteredData.length / pagination.pageSize);

  return (
    <div className="px-4 py-4 md:px-6 w-full">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">Órdenes de Compra - Logística</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-3 w-3" /> Proveedor: {filterProveedor === "todos" ? "Todos" : filterProveedor.split(' ')[0]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterProveedor("todos")}>Todos</DropdownMenuItem>
              {proveedoresUnicos.map(prov => (
                <DropdownMenuItem key={prov} onClick={() => setFilterProveedor(prov)}>{prov}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
          <OrdersTable
            data={filteredData}
            fetchData={fetchOrders}
            pagination={pagination}
            setPagination={setPagination}
            totalPages={totalPages}
            search={search}
            setSearch={setSearch}
            searchFields={searchFields}
            setSearchFields={() => { }}
            handleOpenModal={handleOpenModal}
            handleDownloadGuide={handleDownloadGuide}
          />
        </div>
      </div>

      {typeModal === 'details' && selectedOrder && (
        <ViewOrderDetailsModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default LogisticOrders;