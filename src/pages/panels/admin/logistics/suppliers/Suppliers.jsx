import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SupplierTable from '@/composables/admin/logistics/suppliers/tables/SupplierTable';
import CreateNewSupplierModal from '@/composables/admin/logistics/suppliers/modals/CreateNewSupplierModal';
import UpdateSupplierModal from '@/composables/admin/logistics/suppliers/modals/UpdateSupplierModal';
import SupplierOrderModal from '@/composables/admin/logistics/suppliers/modals/SupplierOrderModal/SupplierOrderModal';
import PlaceaNewOrderModal from '@/composables/admin/logistics/suppliers/modals/PlaceaNewOrderModal';
import useCrud from '@/hooks/useCrud';

const suppliersMock = [
  { id: 1, nombre: "Maquinarias S.A." },
  { id: 2, nombre: "Repuestos Industriales Ltda." },
  { id: 3, nombre: "Equipos Pesados SpA" },
  { id: 4, nombre: "Insumos Mineros" },
  { id: 5, nombre: "Logística Express" },
];

const Suppliers = () => {
  const [proveedores, setProveedores] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [searchFields, setSearchFields] = useState(["nombre", "ruc", "codigo"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { insertModel, getModel, updateModel, deleteModel } = useCrud('/api/v1/admin/suppliers');

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

  const handleSaveProveedor = async (formData) => {
    try {
      const payload = {
        supplier: formData
      };
      await insertModel(payload);
      alert("Proveedor creado exitosamente en el servidor.");
      handleCloseModal();
    } catch (error) {
      console.error("Error al enviar el proveedor al servidor:", error);
      alert("No se pudo crear el proveedor en el servidor. Revisa la consola para más detalles.");
    }
  };

  const handleUpdateProveedor = async (formData) => {
    try {
      const payload = {
        supplier: formData
      };
      
      await updateModel(payload, `/api/v1/admin/suppliers/${formData.id}`);
      alert("Proveedor actualizado exitosamente en el servidor.");
      
      refetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Error al actualizar el proveedor:", error);
      alert("No se pudo actualizar el proveedor en el servidor. Revisa la consola.");
    }
  };


  const handleSaveOrder = async (pedidoData) => {
    try {
      console.log("Pedido creado:", pedidoData);
      alert(`Pedido ${pedidoData.orderId} creado exitosamente para ${pedidoData.proveedor}`);
      handleCloseModal();
    } catch (error) {
      console.error("Error al crear pedido:", error);
      alert("Error al crear el pedido");
    }
  };

  const handleDeleteConfirm = async (proveedorId) => {
    try {
      await deleteModel(`/api/v1/admin/suppliers/${proveedorId}`);
      alert("Proveedor eliminado exitosamente en el servidor.");
      
      refetchData();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
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
            </div>
          </div>

        </div>
      </div>

      {typeModal === 'new' && (
        <CreateNewSupplierModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          onSave={handleSaveProveedor}
        />
      )}
      {typeModal === 'edit' && (
        <UpdateSupplierModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          supplierToEdit={selectedProveedor}
          onSave={handleUpdateProveedor}
        />
      )}
      {typeModal === 'details' && (
        <SupplierOrderModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          supplier={selectedProveedor}
        />
      )}
      {typeModal === 'create' && (
        <PlaceaNewOrderModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          onSave={handleSaveOrder}
          suppliers={suppliersMock}
        />
      )}
    </div>
  );
};

export default Suppliers;