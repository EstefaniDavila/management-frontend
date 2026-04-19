import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, X, Check, Pencil } from "lucide-react";

const UpdateProductModal = ({ 
  product = null,  
  onSave,          
  children,        
  triggerText = "NUEVO PRODUCTO", 
  triggerClassName = "bg-red-600 hover:bg-red-700"
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!product;

  const [form, setForm] = useState({
    id: "",
    desc: "",
    stock: "",
    loc: "",
    type: "repuesto",
  });

  const [errors, setErrors] = useState({});

  
  useEffect(() => {
    if (open && isEditing && product) {
      setForm({
        id: product.id || "",
        desc: product.desc || "",
        stock: product.stock?.toString() || "",
        loc: product.loc || "",
        type: product.type || "repuesto",
      });
    }
  }, [open, isEditing, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.id.trim()) {
      newErrors.id = "El código es requerido";
    } else if (form.id.length < 2) {
      newErrors.id = "El código debe tener al menos 2 caracteres";
    }
    
    if (!form.desc.trim()) {
      newErrors.desc = "La descripción es requerida";
    } else if (form.desc.length < 3) {
      newErrors.desc = "La descripción debe tener al menos 3 caracteres";
    }
    
    if (form.stock === "" || form.stock === null) {
      newErrors.stock = "El stock es requerido";
    } else if (Number(form.stock) < 0) {
      newErrors.stock = "El stock no puede ser negativo";
    }
    
    if (!form.loc.trim()) {
      newErrors.loc = "La ubicación es requerida";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
  
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const savedProduct = {
      ...form,
      stock: Number(form.stock),
      status: form.stock == 0 ? "AGOT" : form.stock < 10 ? "Bajo" : "OK",
    };

    onSave(savedProduct, isEditing);
    setOpen(false);
    setIsSubmitting(false);

    if (!isEditing) {
      setForm({
        id: "",
        desc: "",
        stock: "",
        loc: "",
        type: "repuesto",
      });
    }
    setErrors({});
  };

  const handleCancel = () => {
    setOpen(false);
    
    if (!isEditing) {
      setForm({
        id: "",
        desc: "",
        stock: "",
        loc: "",
        type: "repuesto",
      });
    }
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
        {children || (
          <Button className={`gap-2 shadow-sm text-white font-semibold ${triggerClassName}`}>
            {isEditing ? <Pencil className="h-4 w-4" /> : <Package className="h-4 w-4" />}
            {triggerText}
          </Button>
        )}
      </DialogTrigger>


      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
            {isEditing ? "Editar Producto" : "Registrar Nuevo Producto"}
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEditing 
              ? "Modifique los campos necesarios para actualizar el producto" 
              : "Complete los campos para agregar un nuevo producto al inventario"}
          </p>
        </DialogHeader>

        <div className="grid gap-5 py-4">
    
          <div className="grid gap-2">
            <Label className="text-gray-700 dark:text-gray-300 font-semibold">
              Código <span className="text-red-500">*</span>
            </Label>
            <Input 
              name="id" 
              value={form.id} 
              onChange={handleChange}
              placeholder="Ej: 1R-0750"
              disabled={isEditing} // Deshabilitar edición de código en modo edición
              className={`border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                errors.id ? 'border-red-500 dark:border-red-500' : ''
              } ${isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            {errors.id && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.id}</p>
            )}
            {isEditing && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                El código no puede ser modificado
              </p>
            )}
          </div>

       
          <div className="grid gap-2">
            <Label className="text-gray-700 dark:text-gray-300 font-semibold">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Input 
              name="desc" 
              value={form.desc} 
              onChange={handleChange}
              placeholder="Ej: Filtro de aceite para motor"
              className={`border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                errors.desc ? 'border-red-500 dark:border-red-500' : ''
              }`}
            />
            {errors.desc && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.desc}</p>
            )}
          </div>

       
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-gray-700 dark:text-gray-300 font-semibold">
                Stock <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={`border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                  errors.stock ? 'border-red-500 dark:border-red-500' : ''
                }`}
              />
              {errors.stock && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.stock}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label className="text-gray-700 dark:text-gray-300 font-semibold">
                Ubicación <span className="text-red-500">*</span>
              </Label>
              <Input 
                name="loc" 
                value={form.loc} 
                onChange={handleChange}
                placeholder="Ej: Estante A-1"
                className={`border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                  errors.loc ? 'border-red-500 dark:border-red-500' : ''
                }`}
              />
              {errors.loc && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.loc}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-700 dark:text-gray-300 font-semibold">
              Tipo de Producto
            </Label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="repuesto">🔧 Repuesto</option>
              <option value="maquinaria">🏗️ Maquinaria</option>
            </select>
          </div>

          {form.stock !== "" && form.stock !== null && (
            <div className="mt-2 p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Estado del stock: 
                <span className={`ml-2 font-semibold ${
                  form.stock == 0 ? 'text-red-600 dark:text-red-400' :
                  form.stock < 10 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-green-600 dark:text-green-400'
                }`}>
                  {form.stock == 0 ? 'AGOTADO' : form.stock < 10 ? 'BAJO STOCK' : 'STOCK ÓPTIMO'}
                </span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-gray-200 dark:border-gray-800 pt-4 gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="gap-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {isEditing ? "Actualizando..." : "Guardando..."}
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                {isEditing ? "Actualizar Producto" : "Guardar Producto"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProductModal;