import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SupplierTable from '@/composables/admin/logistics/suppliers/tables/SupplierTable';
import CreateNewSupplierModal from '@/composables/admin/logistics/suppliers/modals/CreateNewSupplierModal';
import UpdateSupplierModal from '@/composables/admin/logistics/suppliers/modals/UpdateSupplierModal';
import DeleteSupplierModal from '@/composables/admin/logistics/suppliers/modals/DeleteSupplierModal';
import SupplierOrderModal from '@/composables/admin/logistics/suppliers/modals/SupplierOrderModal/SupplierOrderModal';
import PlaceaNewOrderModal from '@/composables/admin/logistics/suppliers/modals/PlaceaNewOrderModal';

const fakeProveedores = [
  {
    id: 1,
    codigo: "PROV-001",
    nombre: "Caterpillar Inc.",
    ruc: "20123456789",
    telefono: "987654321",
    email: "ventas@caterpillar.com",
    direccion: "Av. Industrial 123, Lima",
    contacto: "Juan Pérez",
    status: "Activo"
  },
  {
    id: 2,
    codigo: "PROV-002",
    nombre: "Komatsu Perú",
    ruc: "20567891234",
    telefono: "976543210",
    email: "komatsu@komatsu.pe",
    direccion: "Carretera Central Km 12, Ate",
    contacto: "María López",
    status: "Activo"
  },
  {
    id: 3,
    codigo: "PROV-003",
    nombre: "Volvo Parts SAC",
    ruc: "20345678912",
    telefono: "998877665",
    email: "ventas@volvoparts.com",
    direccion: "Av. Universitaria 456, Callao",
    contacto: "Carlos Ramírez",
    status: "Inactivo"
  },
  {
    id: 4,
    codigo: "PROV-004",
    nombre: "Repuestos Diesel EIRL",
    ruc: "20789123456",
    telefono: "965432187",
    email: "rdiesel@diesel.com",
    direccion: "Av. Argentina 789, Lima",
    contacto: "Ana Torres",
    status: "Activo"
  },
  {
    id: 5,
    codigo: "PROV-005",
    nombre: "Maquinarias del Sur",
    ruc: "20456789123",
    telefono: "954321876",
    email: "mdelsur@maquinarias.com",
    direccion: "Panamericana Sur Km 45, Ica",
    contacto: "Luis Fernández",
    status: "Activo"
  }
];

const suppliersMock = [
  { id: 1, nombre: "Maquinarias S.A." },
  { id: 2, nombre: "Repuestos Industriales Ltda." },
  { id: 3, nombre: "Equipos Pesados SpA" },
  { id: 4, nombre: "Insumos Mineros" },
  { id: 5, nombre: "Logística Express" },
];

const Suppliers = () => {
  const [proveedores, setProveedores] = useState(fakeProveedores);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [searchFields, setSearchFields] = useState(["nombre", "ruc", "codigo"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  const refetchData = () => console.log("Refetching proveedores...");

  const totalPages = Math.ceil(proveedores.length / pagination.pageSize);

  const handleOpenModal = (type, proveedor = null) => {
    setIsModalOpen(true);
    setTypeModal(type);
    setSelectedProveedor(proveedor);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTypeModal('');
    setSelectedProveedor(null);
  };

  const handleSaveProveedor = async (formData) => {
    const newProveedor = {
      id: Date.now(),
      codigo: formData.codigo,
      nombre: formData.nombre,
      ruc: formData.ruc,
      telefono: formData.telefono,
      email: formData.email,
      contacto: '',
      direccion: '',
      status: formData.estado === 'activo' ? 'Activo' : 'Inactivo'
    };
    setProveedores(prev => [newProveedor, ...prev]);
    handleCloseModal();
  };

  const handleUpdateProveedor = async (formData) => {
    setProveedores(prev => prev.map(p =>
      p.id === selectedProveedor.id
        ? { ...p, ...formData, status: formData.estado === 'activo' ? 'Activo' : 'Inactivo' }
        : p
    ));
    handleCloseModal();
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
      setProveedores(prev => prev.filter(p => p.id !== proveedorId));
      handleCloseModal();
      alert("Proveedor eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el proveedor");
    }
  };

  return (
    <div className="p-6 w-full min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-6">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              GESTIÓN DE PROVEEDORES
            </h1>
            <Button
              variant="default"
              className="w-full sm:w-auto gap-2 shadow-sm"
              onClick={() => handleOpenModal('new')}
            >
              <Plus className="h-4 w-4" /> NUEVO PROVEEDOR
            </Button>
          </div>

          <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto w-full">
              <div className="inline-block min-w-full align-middle p-4">
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
                />
              </div>
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
      {typeModal === 'delete' && (
        <DeleteSupplierModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          title="Eliminar Proveedor"
          itemName={selectedProveedor?.nombre}
          onConfirm={() => {
            handleDeleteConfirm(selectedProveedor.id);
          }}
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