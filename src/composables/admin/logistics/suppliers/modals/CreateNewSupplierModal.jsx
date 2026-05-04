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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleActionSave = async () => {

    if (!formData.business_name || !formData.document_number || !formData.code) {
      alert("Código, Nombre y RUC son obligatorios");
      return;
    }

    await onSave(formData);
    setOpen(false);
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
            <Label htmlFor="code" className="flex items-center gap-1">
              <Hash className="h-3 w-3" /> Código *
            </Label>
            <Input
              id="code"
              name="code"
              placeholder="PROV-001"
              value={formData.code}
              onChange={handleChange}
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

        <input type="hidden" name="document_type" value="RUC" />
        <input type="hidden" name="status" value="active" />
      </div>
    </Modal>
  )
}

export default CreateNewSupplierModal