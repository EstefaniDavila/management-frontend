import React, { useState, useMemo } from 'react'
import Modal from '@/components/custom/modal'
import { Input } from '@/components/ui/input'
import { handleChange, handleSelectChange } from '@/services/general/handlers'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const UpdateCustomerModal = ({ isOpen, handleClose, customer, onUpdate }) => {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  useMemo(() => {
    if (customer) setFormData({ ...customer })
  }, [customer])

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
    onUpdate(formData)
    handleClose()
  }

  const onChangeExtra = () => {}

  return (
    isOpen && (
      <Modal
        open={isOpen}
        setOpen={handleClose}
        title="Editar Cliente"
        description="Modifique los campos del cliente."
        size="md"
        callBack={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">Razón Social *</label>
            <Input name="business_name" value={formData.business_name || ''} onChange={e => handleChange(e, setFormData, onChangeExtra)} />
            {errors.business_name && <span className="text-xs text-red-500">{errors.business_name}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tipo Documento</label>
            <Select value={formData.document_type} onValueChange={val => handleSelectChange('document_type', val, setFormData, onChangeExtra)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="RUC">RUC</SelectItem>
                <SelectItem value="DNI">DNI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">N° Documento *</label>
            <Input name="document_number" value={formData.document_number || ''} onChange={e => handleChange(e, setFormData, onChangeExtra)} />
            {errors.document_number && <span className="text-xs text-red-500">{errors.document_number}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Contacto</label>
            <Input name="contact_name" value={formData.contact_name || ''} onChange={e => handleChange(e, setFormData, onChangeExtra)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Teléfono</label>
            <Input name="phone" value={formData.phone || ''} onChange={e => handleChange(e, setFormData, onChangeExtra)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Correo</label>
            <Input name="email" value={formData.email || ''} onChange={e => handleChange(e, setFormData, onChangeExtra)} />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Rubro *</label>
            <Select value={formData.client_category} onValueChange={val => handleSelectChange('client_category', val, setFormData, onChangeExtra)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="construccion">Construcción</SelectItem>
                <SelectItem value="mineria">Minería</SelectItem>
                <SelectItem value="transporte">Transporte</SelectItem>
                <SelectItem value="energia">Energía</SelectItem>
              </SelectContent>
            </Select>
            {errors.client_category && <span className="text-xs text-red-500">{errors.client_category}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Estado</label>
            <Select value={formData.status} onValueChange={val => handleSelectChange('status', val, setFormData, onChangeExtra)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">Prioridad Comercial</label>
            <Select value={formData.priority} onValueChange={val => handleSelectChange('priority', val, setFormData, onChangeExtra)}>
              <SelectTrigger><SelectValue placeholder="Seleccione prioridad" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CN">CN - No Deseado</SelectItem>
                <SelectItem value="CP">CP - Potencial</SelectItem>
                <SelectItem value="CR">CR - Reciclado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">Dirección</label>
            <Input name="address" value={formData.address || ''} onChange={e => handleChange(e, setFormData, onChangeExtra)} />
          </div>

        </div>
      </Modal>
    )
  )
}

export default UpdateCustomerModal