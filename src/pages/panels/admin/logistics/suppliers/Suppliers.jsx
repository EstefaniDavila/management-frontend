import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SupplierTable from '@/composables/admin/logistics/suppliers/tables/SupplierTable';
import CreateNewSupplierModal from '@/composables/admin/logistics/suppliers/modals/CreateNewSupplierModal';
import UpdateSupplierModal from '@/composables/admin/logistics/suppliers/modals/UpdateSupplierModal';
import SupplierOrderModal from '@/composables/admin/logistics/suppliers/modals/SupplierOrderModal/SupplierOrderModal';
import CreateNewOrderModal from '@/composables/admin/logistics/ordersSuppliers/modals/CreateNewOrderModal';
import useCrud from '@/hooks/useCrud';
import useEntityMutation from '@/hooks/useEntityMutation';
import RenderProfiler from '@/components/RenderProfiler';

const Suppliers = () => {
  const [proveedores, setProveedores] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [searchFields, setSearchFields] = useState(["nombre", "ruc", "codigo"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getModel } = useCrud('/api/v1/admin/suppliers');
  const supplierMutation = useEntityMutation({ entityName: 'supplier' });
  const orderMutation = useEntityMutation({ entityName: 'purchase_order' });

  const fetchProveedores = async () => {
    try {
      setIsLoading(true);
      const data = await getModel();
      const formattedData = data.map(item => ({
        id: item.id,
        codigo: item.code,
        nombre: item.business_name,
        ruc: item.document_number,
        telefono: item.phone,
        email: item.email,
        direccion: item.address,
        contacto: item.contact_name,
        status: item.status === 'active' ? 'Activo' : 'Inactivo',
        _original: item
      }));

      setProveedores(formattedData);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const refetchData = () => {
    fetchProveedores();
  };

  const totalPages = Math.ceil(proveedores.length / pagination.pageSize);

  const handleOpenModal = (type, proveedor = null) => {
    setIsModalOpen(true);
    setTypeModal(type);
    setSelectedProveedor(proveedor);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTypeModal('');
  };

  const handleSaveProveedor = (formData) => {
    supplierMutation.mutate(
      { action: 'create', entity: formData, endpoint: '/api/v1/admin/suppliers' },
      {
        onSuccess: () => {
          refetchData();
          handleCloseModal();
        }
      }
    );
  };

  const handleUpdateProveedor = (formData) => {
    supplierMutation.mutate(
      { action: 'update', entity: formData, endpoint: `/api/v1/admin/suppliers/${formData.id}`, id: formData.id },
      {
        onSuccess: () => {
          refetchData();
          handleCloseModal();
        }
      }
    );
  };

  const handleSaveOrder = (pedidoData) => {
    orderMutation.mutate(
      { action: 'create', entity: pedidoData, endpoint: '/api/v1/admin/purchase_orders' },
      {
        onSuccess: () => {
          handleCloseModal();
        }
      }
    );
  };

  const handleDeleteConfirm = (proveedorId) => {
    supplierMutation.mutate(
      { action: 'delete', endpoint: `/api/v1/admin/suppliers/${proveedorId}`, id: proveedorId },
      {
        onSuccess: () => {
          refetchData();
        }
      }
    );
  };

  return (
    <RenderProfiler id="Admin-Suppliers-Dashboard">
      <div className="p-6 w-full min-h-screen bg-background">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row items-end justify-between mb-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                GESTIÓN DE PROVEEDORES
              </h1>

              <Button
                variant="default"
                className="h-7 px-2 text-xs gap-1 shadow-sm sm:w-auto w-full"
                onClick={() => handleOpenModal('new')}
              >
                <Plus className="h-4 w-4" /> NUEVO PROVEEDOR
              </Button>

            </div>
            <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4">
                <RenderProfiler id="Admin-Suppliers-TanStack-Table">
                  <SupplierTable
                    data={proveedores}
                    fetchData={refetchData}
                    pagination={pagination}
                    setPagination={setPagination}
                    totalPages={totalPages}
                    search={search}
                    setSearch={setSearch}
                    searchFields={searchFields}
                    setSearchFields={setSearchFields}
                    handleOpenModal={handleOpenModal}
                    handleDeleteConfirm={handleDeleteConfirm}
                  />
                </RenderProfiler>
              </div>
            </div>

          </div>
        </div>

        {typeModal === 'new' && (
          <RenderProfiler id="Admin-CreateSupplier-Modal">
            <CreateNewSupplierModal
              open={isModalOpen}
              setOpen={handleCloseModal}
              onSave={handleSaveProveedor}
            />
          </RenderProfiler>
        )}
        {typeModal === 'edit' && (
          <RenderProfiler id="Admin-UpdateSupplier-Modal">
            <UpdateSupplierModal
              open={isModalOpen}
              setOpen={handleCloseModal}
              supplierToEdit={selectedProveedor}
              onSave={handleUpdateProveedor}
            />
          </RenderProfiler>
        )}
        {typeModal === 'details' && (
          <RenderProfiler id="Admin-SupplierOrder-Modal">
            <SupplierOrderModal
              open={isModalOpen}
              setOpen={handleCloseModal}
              supplier={selectedProveedor}
            />
          </RenderProfiler>
        )}
        {typeModal === 'create' && (
          <RenderProfiler id="Admin-CreateOrder-Modal">
            <CreateNewOrderModal
              open={isModalOpen}
              setOpen={handleCloseModal}
              onSave={handleSaveOrder}
              suppliers={proveedores}
              initialSupplierId={selectedProveedor?.id}
            />
          </RenderProfiler>
        )}
      </div>
    </RenderProfiler>
  );
};

export default Suppliers;