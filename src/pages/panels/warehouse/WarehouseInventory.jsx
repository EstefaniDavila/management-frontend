import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import WarehouseInventoryTable from '@/composables/warehouse/inventory/WarehouseInventoryTable';
import UpdateProductModal from '@/composables/admin/logistics/inventory/modals/UpdateProductModal';
import HistoryProductModal from '@/composables/admin/logistics/inventory/modals/HistoryProduct/HistoryProductModal';
import useCrud from '@/hooks/useCrud';

const WarehouseInventory = () => {
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

  const { getModel } = useCrud('/api/v1/warehouse/products?active=true');

  const getProductStatus = (item) => {
    if (!item.active) return "inactivo";

    if (item.product_type === "vehicle") {
      return item.vehicle?.status || "available";
    }

    if (item.product_type === "spare_part") {
      const stock = item.spare_part?.stock || 0;
      const minStock = item.spare_part?.min_stock || 0;

      if (stock === 0) return "agot";
      if (stock < minStock) return "bajo";

      return "ok";
    }

    return "desconocido";
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getModel();
      const productsArray = Array.isArray(response) ? response : (response?.data || []);

      const filteredArray = productsArray.filter(item => {

        if (item.product_type === "vehicle") {
          return item.vehicle?.status === "available";
        }

        return true;
      });

      console.log("Productos antes:", productsArray.length);
      console.log("Productos después del filtro:", filteredArray.length);

      const formattedData = filteredArray.map((item) => {
        const isVehicle = item.product_type === "vehicle";

        return {
          id: item.code,
          desc: item.name,
          type: isVehicle ? "maquinaria" : "repuesto",
          stock: isVehicle ? '-' : (item.spare_part?.stock || 0),
          loc: isVehicle
            ? (item.vehicle?.location || 'No asignado')
            : (item.spare_part?.category || 'No asignado'),
          status: getProductStatus(item),
          product_type: item.product_type,
          _original: item,
        };
      });

      setProducts(formattedData);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const refetchData = () => fetchProducts();

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



  const filteredData = products.filter(item => {
    const statusVal = item.status || "";
    const matchStatus = filterStatus === "todos" || statusVal.toLowerCase() === filterStatus.toLowerCase();
    const matchType = filterType === "todos" || item.type === filterType;
    return matchStatus && matchType;
  });

  const totalPages = Math.ceil(filteredData.length / pagination.pageSize);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando inventario...</div>;
  }

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


        </div>

        <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle p-4"></div>
            <WarehouseInventoryTable
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

export default WarehouseInventory;