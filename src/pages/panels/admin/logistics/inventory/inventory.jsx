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

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getModel();

      const productsArray = response.data || (Array.isArray(response) ? response : []);

      const formattedData = productsArray.map(item => {
        let currentStock = 0;
        let minStock = 5;
        let location = "No asignado";

        // Si es vehículo
        if (item.product_type === "vehicle" && item.vehicle) {
          currentStock = item.vehicle.status === "available" ? 1 : 0;
          minStock = 1;
          location = item.vehicle.location || "No asignado";
        }
        // Si es repuesto
        else if (item.product_type === "spare_part" && item.spare_part) {
          currentStock = item.spare_part.stock || 0;
          minStock = item.spare_part.min_stock || 5;
          location = item.spare_part.manufacturer_brand || "No asignado";
        }

        return {
          id: item.code,
          desc: item.name,
          stock: currentStock,
          stockmin: minStock,
          loc: location,
          state: item.active ? "ACTIVO" : "INACTIVO",
          status: currentStock === 0 ? "AGOT" : currentStock < minStock ? "Bajo" : "OK",
          type: item.product_type === "spare_part" ? "Repuesto" : "Maquinaria",
          base_price: `$${parseFloat(item.base_price || 0).toFixed(2)}`,
          _original: item
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

  const handleSaveProduct = async (newProduct) => {
    try {
      console.log("Guardando producto:", newProduct);

      const productToAdd = {
        id: newProduct.codigo,
        desc: newProduct.desc,
        stock: parseInt(newProduct.stock),
        loc: newProduct.loc,
        type: newProduct.type,
        status: "OK"
      };

      setProducts(prev => [productToAdd, ...prev]);

      handleCloseModal();

      alert("Producto creado exitosamente");

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al crear el producto");
    }
  };

  const handleUpdateProduct = async (updatedData) => {
    try {
      console.log("Datos actualizados:", updatedData);

      const updatedProduct = {
        id: updatedData.codigo,
        desc: updatedData.desc,
        stock: parseInt(updatedData.stock),
        loc: updatedData.loc,
        type: updatedData.type,
        status: updatedData.stock == 0 ? "AGOT" : updatedData.stock < 10 ? "Bajo" : "OK"
      };

      setProducts(prev =>
        prev.map(p => p.id === selectedProduct.id ? updatedProduct : p)
      );

      handleCloseModal();
      alert("Producto actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el producto");
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      console.log("Eliminando producto:", product);

      setProducts(prev => prev.filter(p => p.id !== product.id));
      handleCloseModal();

    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el producto");
    }
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
                Type: {filterType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType("todos")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("maquinaria")}>Machinery</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("repuesto")}>Parts</DropdownMenuItem>
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
            />
          </div>
        </div>

      </div>

      {typeModal === 'create' && (
        <CreateProductModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          onSave={handleSaveProduct}
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
      {typeModal === 'delete' && (
        <DeleteProductModal
          open={isModalOpen}
          setOpen={handleCloseModal}
          product={selectedProduct}
          onConfirm={handleDeleteProduct}
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