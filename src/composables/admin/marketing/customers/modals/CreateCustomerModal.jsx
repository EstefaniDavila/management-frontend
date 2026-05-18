import React, { useState } from 'react'
import Modal from '@/components/custom/modal'
import { Input } from '@/components/ui/input'
import { handleChange, handleSelectChange } from '@/services/general/handlers'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select'

const initialForm = {
  business_name: '', document_type: 'RUC', document_number: '',
  contact_name: '', phone: '', email: '',
  address: '', client_category: '', status: 'active'
}

const CreateCustomerModal = ({ isOpen, handleClose, onCreate }) => {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!formData.business_name) e.business_name = 'Razón social obligatoria'
    if (!formData.document_number) e.document_number = 'Documento obligatorio'
    if (!formData.client_category) e.client_category = 'Rubro obligatorio'
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Email inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const newCustomer = {
      ...formData,
      id: Date.now(),
      code: `CUST-${String(Date.now()).slice(-3)}`,
    }
    onCreate(newCustomer)
    setFormData(initialForm)
    setErrors({})
    handleClose()
  }

  const onChangeExtra = () => {}

  return (
    isOpen && (
      <Modal
        open={isOpen}
        setOpen={handleClose}
        title="Nuevo Cliente"
        description="Complete los campos para registrar un nuevo cliente."
        size="md"
        callBack={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">

          {/* Razón Social */}
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">Razón Social *</label>
            <Input
              name="business_name"
              value={formData.business_name}
              onChange={e => handleChange(e, setFormData, onChangeExtra)}
              placeholder="Constructora Lima SAC"
            />
            {errors.business_name && <span className="text-xs text-red-500">{errors.business_name}</span>}
          </div>

          {/* Tipo Documento */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tipo Documento *</label>
            <Select
              value={formData.document_type}
              onValueChange={val => handleSelectChange('document_type', val, setFormData, onChangeExtra)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="RUC">RUC</SelectItem>
                <SelectItem value="DNI">DNI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* N° Documento */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">N° Documento *</label>
            <Input
              name="document_number"
              value={formData.document_number}
              onChange={e => handleChange(e, setFormData, onChangeExtra)}
              placeholder="20601234567"
            />
            {errors.document_number && <span className="text-xs text-red-500">{errors.document_number}</span>}
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre de Contacto</label>
            <Input
              name="contact_name"
              value={formData.contact_name}
              onChange={e => handleChange(e, setFormData, onChangeExtra)}
              placeholder="Juan Pérez"
            />
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Teléfono</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={e => handleChange(e, setFormData, onChangeExtra)}
              placeholder="987654321"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Correo</label>
            <Input
              name="email"
              value={formData.email}
              onChange={e => handleChange(e, setFormData, onChangeExtra)}
              placeholder="contacto@empresa.com"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>

          {/* Rubro */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Rubro *</label>
            <Select
              value={formData.client_category}
              onValueChange={val => handleSelectChange('client_category', val, setFormData, onChangeExtra)}
            >
              <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="construccion">Construcción</SelectItem>
                <SelectItem value="mineria">Minería</SelectItem>
                <SelectItem value="transporte">Transporte</SelectItem>
                <SelectItem value="energia">Energía</SelectItem>
              </SelectContent>
            </Select>
            {errors.client_category && <span className="text-xs text-red-500">{errors.client_category}</span>}
          </div>

          {/* Dirección */}
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">Dirección</label>
            <Input
              name="address"
              value={formData.address}
              onChange={e => handleChange(e, setFormData, onChangeExtra)}
              placeholder="Av. Industrial 123, Lima"
            />
          </div>

        </div>
      </Modal>
    )
  )
}

export default CreateCustomerModal