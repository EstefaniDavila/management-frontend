import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import GeneralInventoryTable from '@/composables/admin/logistics/inventory/tables/GeneralInventoryTable';
import CreateProductModal from '@/composables/admin/logistics/inventory/modals/CreateProductModal';
import UpdateProductModal from '@/composables/admin/logistics/inventory/modals/UpdateProductModal';
import HistoryProductModal from '@/composables/admin/logistics/inventory/modals/HistoryProduct/HistoryProductModal';
import DeleteProductModal from '@/composables/admin/logistics/inventory/modals/DeleteProductModal';
import useCrud from '@/hooks/useCrud';
import useEntityMutation from '@/hooks/useEntityMutation';
import { useAuth } from '@/providers/UserContext';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [searchFields, setSearchFields] = useState(["id", "desc"]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterType, setFilterType] = useState("todos");
  const [typeModal, setTypeModal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getModel } = useCrud('/api/v1/admin/products');
  const productMutation = useEntityMutation({ entityName: 'product' });
  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const response = await getModel();

      const productsArray =
        response.data || (Array.isArray(response) ? response : []);

      const formattedData = productsArray.map((item) => {
        const isVehicle = item.product_type === "vehicle";
        const isSparePart = item.product_type === "spare_part";

        return {
          id: item.code,
          desc: item.name,
          type: isVehicle ? "Maquinaria" : "Repuesto",

          inventoryValue: isVehicle
            ? item.vehicle?.status || "unknown"
            : item.spare_part?.stock || 0,

          secondaryValue: isVehicle
            ? item.vehicle?.hours_used || 0
            : item.spare_part?.min_stock || 0,

          locationValue: isVehicle
            ? item.vehicle?.location || "No asignado"
            : item.spare_part?.manufacturer_brand || "No asignado",

          state: item.active ? "ACTIVO" : "INACTIVO",

          status:
            isSparePart
              ? (item.spare_part?.stock || 0) === 0
                ? "AGOT"
                : (item.spare_part?.stock || 0) <
                  (item.spare_part?.min_stock || 0)
                  ? "Bajo"
                  : "OK"
              : item.vehicle?.status || "available",

          base_price: `$${parseFloat(item.base_price || 0).toFixed(2)}`,
          product_type: item.product_type,
          _original: item,
        };
      });

      setProducts(formattedData);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refetchData = () => {
    fetchProducts();
  };

  const handleOpenModal = (type, product = null) => {
    setTypeModal(type);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setTypeModal("");
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleSaveProduct = async (payload) => {
    productMutation.mutate(
      {
        action: 'create',
        entity: payload,
        endpoint: '/api/v1/admin/products'
      },
      {
        onSuccess: () => {
          refetchData();
          handleCloseModal();
        }
      }
    );
  };

  const handleUpdateProduct = async (productData) => {
    try {
      const productId = selectedProduct._original?.id || selectedProduct.id;

      console.log("ID del producto a actualizar:", productId);
      console.log("Datos a enviar:", productData);

      if (!productId) {
        alert("Error: No se pudo identificar el producto");
        return;
      }

      productMutation.mutate(
        {
          action: 'update',
          id: productId,
          entity: productData,
          endpoint: `/api/v1/admin/products/${productId}`
        },
        {
          onSuccess: (response) => {
            console.log("Respuesta exitosa:", response);
            fetchProducts();
            handleCloseModal();
          },
          onError: (error) => {

          }
        }
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar el producto");
    }
  };

  const handleDeleteProduct = async (product) => {
    console.log("Eliminando producto:", product);
    productMutation.mutate(
      {
        action: 'delete',
        id: product._original.id,
        endpoint: `/api/v1/admin/products/${product._original.id}`
      },
      {
        onSuccess: () => {
          refetchData();
          handleCloseModal();
        }
      }
    );
  };

  const filteredData = products.filter(item => {
    const matchStatus = filterStatus === "todos" || item.status.toLowerCase() === filterStatus.toLowerCase();
    const matchType = filterType === "todos" || item.type === filterType;
    return matchStatus && matchType;
  });

  const totalPages = Math.ceil(filteredData.length / pagination.pageSize);

  return (
    <div className="px-4 py-4 md:px-6 w-full">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-4">

        <h1 className="text-base font-semibold tracking-tight text-foreground">
          Inventory — Parts & Machinery
        </h1>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-3.5 w-3.5" />
                Status: {filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("todos")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("OK")}>OK</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Bajo")}>Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("AGOT")}>Out of stock</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-3.5 w-3.5" />
                Tipo: {filterType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType("todos")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("Maquinaria")}>Maquinaria</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("Repuesto")}>Respuestos</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            onClick={() => handleOpenModal('create')}
            className="ml-auto"
          >
            + Nuevo Producto
          </Button>
        </div>

        <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle p-4"></div>
            <GeneralInventoryTable
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
              handleDeleteProduct={handleDeleteProduct}
            />
          </div>
        </div>

      </div>

      {typeModal === 'create' && (
        <CreateProductModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          onSave={handleSaveProduct}
          currentUserId={user?.id}
        />
      )}


      {isModalOpen && typeModal === 'edit' && (
        <UpdateProductModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          productToEdit={selectedProduct}
          onSave={handleUpdateProduct}
        />
      )}
      {typeModal === 'history' && (
        <HistoryProductModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          product={selectedProduct}
        />
      )}

    </div>
  );
};

export default Inventory;