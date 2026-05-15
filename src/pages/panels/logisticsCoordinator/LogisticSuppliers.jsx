import React, { useState, useEffect } from 'react';
import LogisticSupplierTable from '@/composables/logisticsCoordinator/suppliers/table/LogisticSupplerTable';
import SupplierOrderModal from '@/composables/admin/logistics/suppliers/modals/SupplierOrderModal/SupplierOrderModal';
import CreateNewOrderModalLogistic from '@/composables/logisticsCoordinator/suppliers/modals/CreateNewOrderModalLogistic';

import useCrud from '@/hooks/useCrud';
import useEntityMutation from '@/hooks/useEntityMutation';

const Suppliers = () => {

  const { getModel } = useCrud('/api/v1/logistic_user/suppliers');
  const { insertModel } = useCrud('/api/v1/logistic_user/purchase_orders');

  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const [search, setSearch] = useState("");

  const [searchFields, setSearchFields] = useState([
    "nombre"
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  useEffect(() => {

    const fetchSuppliers = async () => {

      try {

        setLoading(true);

        const response = await getModel();

        console.log("SUPPLIERS API:", response);

        const formattedSuppliers = response.map((supplier) => ({
          id: supplier.id,
          codigo: supplier.code,
          nombre: supplier.business_name,
          ruc: supplier.document_number,
          telefono: supplier.phone,
          email: supplier.email,
          direccion: supplier.address,
          contacto: supplier.contact_name,
          ciudad: supplier.city,
          tipoDocumento: supplier.document_type,
          status:
            supplier.status === 'active'
              ? 'Activo'
              : 'Inactivo'
        }));

        const activos = formattedSuppliers.filter(
          (p) => p.status === 'Activo'
        );

        setProveedores(activos);

      } catch (error) {

        console.error("Error obteniendo proveedores:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchSuppliers();

  }, []);

  const refetchData = async () => {
    return [];
  };

  const totalPages = Math.ceil(
    proveedores.length / pagination.pageSize
  );

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

  const { mutateAsync: createPurchaseOrder } = useEntityMutation({
    entityName: 'purchase_orders'
  });

  const handleSaveOrder = async (pedidoData) => {
    try {

      await createPurchaseOrder({
        action: "create",
        entity: pedidoData,
        endpoint: '/api/v1/logistic_user/purchase_orders'
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const suppliersMock = proveedores.map((p) => ({
    id: p.id,
    nombre: p.nombre
  }));

  return (
    <div className="p-6 w-full min-h-screen bg-background">

      <div className="max-w-[1600px] mx-auto">

        <div className="flex flex-col gap-6">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              GESTIÓN DE PROVEEDORES
            </h1>

          </div>

          <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">

            <div className="overflow-x-auto w-full">

              <div className="inline-block min-w-full align-middle p-4">

                {loading ? (

                  <div className="py-10 text-center">
                    Cargando proveedores...
                  </div>

                ) : (

                  <LogisticSupplierTable
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

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* DETAILS */}
      {typeModal === 'details' && (
        <SupplierOrderModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          supplier={selectedProveedor}
        />
      )}

      {/* CREATE */}
      {typeModal === 'create' && (
        <CreateNewOrderModalLogistic
          open={isModalOpen}
          setOpen={handleCloseModal}
          onSave={handleSaveOrder}
          suppliers={suppliersMock}
          initialSupplierId={selectedProveedor?.id}
        />
      )}

    </div>
  );
};

export default Suppliers;