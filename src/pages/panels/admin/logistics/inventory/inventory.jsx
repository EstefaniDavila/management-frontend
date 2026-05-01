import React, { useState } from 'react';
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

const fakeInventory = {
  rows: [
    { id: "1R-0750", desc: "Filtro aceite", stock: 47, stockmin: 5, loc: "Estante A", state: "ACTIVO", status: "OK", type: "repuesto", base_price: "$15.00" },
    { id: "153-5710", desc: "Batería 12V", stock: 8, stockmin: 15, loc: "Estante B", state: "ACTIVO", status: "Bajo", type: "repuesto", base_price: "$120.00" },
    { id: "CAT-C15", desc: "Retroexcavadora JCB 3CX", stock: 3, stockmin: 10, loc: "Zona 1", state: "INACTIVO", status: "OK", type: "maquinaria", base_price: "$25,000.00" },
    { id: "9X-2012", desc: "Kit junta motor", stock: 0, stockmin: 6, loc: "Estante C", state: "ACTIVO", status: "AGOT", type: "repuesto", base_price: "$45.00" },
    { id: "7E-7777", desc: "Volquete Volvo FMX", stock: 15, stockmin: 8, loc: "Estante A", state: "ACTIVO", status: "OK", type: "maquinaria", base_price: "$95,000.00" },
  ],
  rowCount: 47
};

const Inventory = () => {
  const [products, setProducts] = useState(fakeInventory.rows);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [searchFields, setSearchFields] = useState(["id", "desc"]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterType, setFilterType] = useState("todos");
  const [typeModal, setTypeModal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const refetchData = () => console.log("Refetching data...");

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