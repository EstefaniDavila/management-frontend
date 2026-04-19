import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import GeneralProveedoresTable from '../../../../../composables/admin/logistics/suppliers/tables/GeneralProveedoresTable';

const Suppliers = () => {
  const fakeProveedores = {
    rows: [
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
    ],
    rowCount: 25
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  const [search, setSearch] = useState("");
  const [searchFields, setSearchFields] = useState(["nombre", "ruc", "codigo"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  const refetchData = () => {
    console.log("Refetching proveedores...");
  };

  const totalPages = Math.ceil(fakeProveedores.rowCount / pagination.pageSize);

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

  const handleEdit = (proveedor) => {
    handleOpenModal('edit', proveedor);
  };

  const handleDelete = (id) => {
    console.log("Eliminar proveedor:", id);
  };


  const handleViewDetails = (proveedor) => {
    console.log("Ver detalles:", proveedor);
    alert(`Ver detalles de ${proveedor.nombre}`);
  };


  const handleCreateOrder = (proveedor) => {
    console.log("Realizar pedido a:", proveedor);
    alert(`Crear pedido para ${proveedor.nombre}`);
  };

  return (
    <div className="p-6 w-full min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-6">
          {/* Cabecera */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              GESTIÓN DE PROVEEDORES
            </h1>
            <Button 
              variant="default" 
              className="gap-2 shadow-sm"
              onClick={() => handleOpenModal('new')}
            >
              <Plus className="h-4 w-4" /> NUEVO PROVEEDOR
            </Button>
          </div>


          <div className="w-full bg-card rounded-xl border shadow-sm p-4">
            <GeneralProveedoresTable
              data={fakeProveedores.rows}
              fetchData={refetchData}
              pagination={pagination}
              setPagination={setPagination}
              totalPages={totalPages}
              search={search}
              setSearch={setSearch}
              searchFields={searchFields}
              setSearchFields={setSearchFields}
              onEditProveedor={handleEdit}
              onDeleteProveedor={handleDelete}
              onViewDetails={handleViewDetails}      
              onCreateOrder={handleCreateOrder}     
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;