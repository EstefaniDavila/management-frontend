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
    code: '',
    business_name: '',
    document_number: '',
    document_type: 'RUC',
    contact_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    status: 'active'
  });

  useEffect(() => {
    if (supplierToEdit && open) {
      // Priorizamos los datos crudos originales del backend (_original) si existen
      const raw = supplierToEdit._original || supplierToEdit;

      setFormData({
        code: raw.code || raw.codigo || '',
        business_name: raw.business_name || raw.nombre || '',
        document_number: raw.document_number || raw.ruc || '',
        document_type: raw.document_type || 'RUC',
        contact_name: raw.contact_name || raw.contacto || '',
        phone: raw.phone || raw.telefono || '',
        email: raw.email || '',
        address: raw.address || raw.direccion || '',
        city: raw.city || '',
        status: raw.status === 'Activo' ? 'active' : (raw.status === 'Inactivo' ? 'inactive' : (raw.status || 'active'))
      });
    }
  }, [supplierToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleActionSave = async () => {
    if (!formData.business_name || !formData.document_number || !formData.code) {
      alert("Código, Nombre y RUC son obligatorios");
      return;
    }

    await onSave({ ...formData, id: supplierToEdit?.id });
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
      description={`Modificando información de: ${supplierToEdit?.business_name || supplierToEdit?.nombre || 'Proveedor'}`}
      size="md"
      callBack={handleActionSave}
    >
      <div className="grid gap-4 py-5">

        {/* Fila 1: Código y RUC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="code" className="flex items-center gap-1 text-muted-foreground">
              <Hash className="h-3 w-3" /> Código (No editable)
            </Label>
            <Input
              id="code"
              name="code"
              placeholder="PROV-001"
              value={formData.code}
              disabled
              className="bg-muted font-mono"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="document_number">RUC *</Label>
            <Input
              id="document_number"
              name="document_number"
              placeholder="20123456789"
              value={formData.document_number}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="business_name" className="flex items-center gap-1">
            <User className="h-3 w-3" /> Nombre / Razón Social *
          </Label>
          <Input
            id="business_name"
            name="business_name"
            placeholder="Ej: Distribuidora Industrial S.A.C."
            value={formData.business_name}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact_name" className="flex items-center gap-1">
              <User className="h-3 w-3" /> Persona Contacto
            </Label>
            <Input
              id="contact_name"
              name="contact_name"
              placeholder="Juan Pérez"
              value={formData.contact_name}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone" className="flex items-center gap-1">
              <Phone className="h-3 w-3" /> Teléfono
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="987654321"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              name="city"
              placeholder="Lima"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            name="address"
            placeholder="Av. Industrial 123"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Estado Actual
          </Label>
          <Select
            value={formData.status}
            onValueChange={(val) => setFormData({ ...formData, status: val })}
          >
            <SelectTrigger className={formData.status === 'active' ? "border-green-200" : "border-red-200"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                <span className="text-green-600 font-medium">Activo</span>
              </SelectItem>
              <SelectItem value="inactive">
                <span className="text-red-600 font-medium">Inactivo</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <input type="hidden" name="document_type" value={formData.document_type} />
      </div>
    </Modal>
  )
}

export default UpdateSupplierModal