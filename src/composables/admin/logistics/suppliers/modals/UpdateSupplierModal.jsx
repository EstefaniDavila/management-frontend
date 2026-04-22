import React, { useState, useEffect } from 'react'
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
import { Building2, Phone, Mail, Hash, User, ShieldCheck, Pencil } from 'lucide-react'

const UpdateSupplierModal = ({ open, setOpen, onSave, supplierToEdit }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    ruc: '',
    telefono: '',
    email: '',
    estado: 'activo'
  });

  useEffect(() => {
    if (supplierToEdit && open) {
      setFormData({
        codigo: supplierToEdit.codigo || '',
        nombre: supplierToEdit.nombre || '',
        ruc: supplierToEdit.ruc || '',
        telefono: supplierToEdit.telefono || '',
        email: supplierToEdit.email || '',
        estado: supplierToEdit.estado || 'activo'
      });
    }
  }, [supplierToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleActionSave = async () => {
    if (!formData.nombre || !formData.ruc) {
      alert("Nombre y RUC son campos obligatorios");
      return;
    }
    
    await onSave({ ...formData, id: supplierToEdit.id });
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <div className="flex items-center gap-2 text-primary">
          <Pencil className="h-5 w-5" />
          <span>Editar Proveedor</span>
        </div>
      }
      description={`Modificando información de: ${supplierToEdit?.nombre || 'Proveedor'}`}
      size="md"
      callBack={handleActionSave}
    >
      <div className="grid gap-4 py-5">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="codigo" className="text-muted-foreground">Código (No editable)</Label>
            <Input
              id="codigo"
              name="codigo"
              value={formData.codigo}
              disabled
              className="bg-muted font-mono"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ruc">RUC *</Label>
            <Input
              id="ruc"
              name="ruc"
              placeholder="20123456789"
              value={formData.ruc}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="nombre">Nombre / Razón Social *</Label>
          <Input
            id="nombre"
            name="nombre"
            placeholder="Ej: Distribuidora Industrial S.A.C."
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="telefono" className="flex items-center gap-1">
              <Phone className="h-3 w-3" /> Teléfono
            </Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              <Mail className="h-3 w-3" /> Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Estado Actual
          </Label>
          <Select
            value={formData.estado}
            onValueChange={(val) => setFormData({ ...formData, estado: val })}
          >
            <SelectTrigger className={formData.estado === 'activo' ? "border-green-200" : "border-red-200"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">
                <span className="text-green-600 font-medium">Activo</span>
              </SelectItem>
              <SelectItem value="inactivo">
                <span className="text-red-600 font-medium">Inactivo</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Modal>
  )
}

export default UpdateSupplierModal