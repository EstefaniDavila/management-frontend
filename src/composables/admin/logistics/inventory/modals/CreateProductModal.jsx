import React, { useState } from 'react'
import Modal from '@/components/custom/modal'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

const CreateProductModal = ({ open, setOpen, onSave }) => {

  const [formData, setFormData] = useState({
    codigo: '',
    desc: '',
    stock: 0,
    loc: '',
    type: 'repuesto'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleActionSave = async () => {
    if (!formData.codigo || !formData.desc) {
      alert("Código y Descripción son obligatorios");
      return;
    }

    await onSave(formData);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Nuevo Producto"
      description="Complete los campos para registrar el producto en el inventario."
      size="md"
      callBack={handleActionSave}
    >

      <div className="grid gap-4 py-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="codigo">Código *</Label>
          <Input
            id="codigo"
            name="codigo"
            placeholder="Ej: 1R-0750"
            value={formData.codigo}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="desc">Descripción *</Label>
          <Input
            id="desc"
            name="desc"
            placeholder="Nombre del producto"
            value={formData.desc}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="stock">Stock *</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="loc">Ubicación *</Label>
            <Input
              id="loc"
              name="loc"
              placeholder="Estante / Zona"
              value={formData.loc}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Tipo de Producto</Label>
          <Select
            defaultValue={formData.type}
            onValueChange={(val) => setFormData({ ...formData, type: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="repuesto">Repuesto</SelectItem>
              <SelectItem value="maquinaria">Maquinaria</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Modal>
  )
}

export default CreateProductModal