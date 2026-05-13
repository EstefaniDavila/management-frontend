import React, { useState, useEffect } from 'react'
import Modal from '@/components/custom/modal'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const UpdateProductModal = ({ open, setOpen, onSave, productToEdit }) => {

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    base_price: 0,
    active: true
  });

  useEffect(() => {
    if (productToEdit && open) {
      console.log("Producto a editar:", productToEdit); // Para debugging

      // Extraer valores según la estructura del padre
      const code = productToEdit.id || productToEdit.code || '';
      const name = productToEdit.desc || productToEdit.name || '';
      const description = productToEdit._original?.description || productToEdit.description || '';

      // Limpiar el precio (quitar $ y convertir a número)
      let basePrice = 0;
      if (productToEdit.base_price) {
        if (typeof productToEdit.base_price === 'string') {
          basePrice = parseFloat(productToEdit.base_price.replace('$', '')) || 0;
        } else {
          basePrice = parseFloat(productToEdit.base_price) || 0;
        }
      }

      // Determinar estado activo
      const active = productToEdit.state === 'ACTIVO' || productToEdit.active === true;

      setFormData({
        code: code,
        name: name,
        description: description,
        base_price: basePrice,
        active: active
      });
    }
  }, [productToEdit, open]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleActionSave = async () => {
    if (!formData.name) {
      alert("El nombre es obligatorio");
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      base_price: formData.base_price,
      active: formData.active
    };

    console.log("Enviando desde modal:", JSON.stringify(productData, null, 2));
    await onSave(productData);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Editar Producto"
      description="Modifique los campos necesarios del producto."
      size="md"
      callBack={handleActionSave}
    >
      <div className="grid gap-5 py-5">
        {/* Código - Solo lectura */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-semibold text-gray-700">
            Código
          </Label>
          <Input
            id="code"
            name="code"
            value={formData.code}
            disabled
            readOnly
            className="bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">El código no se puede modificar</p>
        </div>

        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Nombre del producto"
            value={formData.name}
            onChange={handleChange}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Descripción y Precio en grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Descripción
            </Label>
            <Input
              id="description"
              name="description"
              placeholder="Opcional"
              value={formData.description}
              onChange={handleChange}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_price" className="text-sm font-semibold text-gray-700">
              Precio Base <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 font-medium">$</span>
              <Input
                id="base_price"
                name="base_price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.base_price}
                onChange={handleChange}
                className="pl-7 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Estado con botones mejorados */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Estado del Producto</Label>
          <div className="flex gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, active: true })}
              className={`
                flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-200
                ${formData.active
                  ? 'bg-white text-green-700 shadow-sm border border-green-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }
              `}
            >
              <span className="inline-flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${formData.active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                Activo
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, active: false })}
              className={`
                flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-200
                ${!formData.active
                  ? 'bg-white text-red-700 shadow-sm border border-red-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }
              `}
            >
              <span className="inline-flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${!formData.active ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                Inactivo
              </span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formData.active
              ? "✓ El producto estará disponible para cotizaciones y ventas"
              : "✗ El producto no aparecerá en el catálogo activo"}
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default UpdateProductModal