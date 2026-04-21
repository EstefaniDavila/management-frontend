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
import { Building2, Phone, Mail, Hash, User } from 'lucide-react'

const CreateNewSupplierModal = ({ open, setOpen, onSave }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    ruc: '',
    telefono: '',
    email: '',
    estado: 'activo'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleActionSave = async () => {
    // Validación básica
    if (!formData.nombre || !formData.ruc || !formData.codigo) {
      alert("Código, Nombre y RUC son obligatorios");
      return;
    }

    await onSave(formData);
    setOpen(false); // Cerramos tras guardar
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <span>Nuevo Proveedor</span>
        </div>
      }
      description="Registre la información fiscal y de contacto del nuevo proveedor."
      size="md"
      callBack={handleActionSave}
    >
      <div className="grid gap-4 py-5">
        
        {/* Fila 1: Código y RUC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="codigo" className="flex items-center gap-1">
              <Hash className="h-3 w-3" /> Código *
            </Label>
            <Input
              id="codigo"
              name="codigo"
              placeholder="PROV-001"
              value={formData.codigo}
              onChange={handleChange}
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

        {/* Fila 2: Nombre / Razón Social */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="nombre" className="flex items-center gap-1">
            <User className="h-3 w-3" /> Nombre / Razón Social *
          </Label>
          <Input
            id="nombre"
            name="nombre"
            placeholder="Ej: Distribuidora Industrial S.A.C."
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>

        {/* Fila 3: Teléfono y Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="telefono" className="flex items-center gap-1">
              <Phone className="h-3 w-3" /> Contacto Teléfono
            </Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              placeholder="+51 999..."
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
              placeholder="correo@empresa.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Fila 4: Estado */}
        <div className="flex flex-col gap-2">
          <Label>Estado del Proveedor</Label>
          <Select
            value={formData.estado}
            onValueChange={(val) => setFormData({ ...formData, estado: val })}
          >
            <SelectTrigger className={formData.estado === 'activo' ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              <SelectValue placeholder="Seleccione estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo" className="text-green-600">Activo</SelectItem>
              <SelectItem value="inactivo" className="text-red-600">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Modal>
  )
}

export default CreateNewSupplierModal