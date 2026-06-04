import React, { useState, useEffect } from 'react'
import Modal from '@/components/custom/modal'
import { Input } from '@/components/ui/input'
import { handleChange, handleSelectChange } from '@/services/general/handlers'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select'

const initialForm = {
  document_type: 'DNI',
  document_number: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  position: '',
  area: '',
}

const UpdateUserModal = ({ isOpen, handleClose, onUpdate, user }) => {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setFormData({
        document_type: user.roleable?.document_type || 'DNI',
        document_number: user.document_number || user.roleable?.document_number || '',
        first_name: user.roleable?.first_name || '',
        last_name: user.roleable?.last_name || '',
        email: user.email || '',
        phone: user.phone || user.roleable?.phone || '',
        position: user.roleable?.position || '',
        area: user.roleable?.area || '',
      })
    }
  }, [user])

  const validate = () => {
    const e = {}
    if (!formData.document_number) e.document_number = 'Documento obligatorio'
    if (!formData.first_name) e.first_name = 'Nombre obligatorio'
    if (!formData.last_name) e.last_name = 'Apellido obligatorio'
    if (!formData.email) e.email = 'Correo obligatorio'
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Email inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    
    // Preparar el payload
    const { email, phone, ...role_attributes } = formData
    role_attributes.full_name = `${role_attributes.first_name} ${role_attributes.last_name}`.trim()

    const payload = {
      id: user.id,
      user: {
        email,
        phone,
      },
      role_attributes
    }

    onUpdate(payload)
    setErrors({})
  }

  const onChangeExtra = () => {}

  return (
    isOpen && (
      <Modal
        open={isOpen}
        setOpen={handleClose}
        title="Editar Usuario"
        description="Modifique los campos correspondientes."
        size="md"
        callBack={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">

          {/* Tipo Documento */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tipo Documento *</label>
            <Select
              value={formData.document_type}
              onValueChange={val => handleSelectChange('document_type', val, setFormData, onChangeExtra)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DNI">DNI</SelectItem>
                <SelectItem value="CE">Carnet de Extranjería</SelectItem>
                <SelectItem value="Pasaporte">Pasaporte</SelectItem>
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
              placeholder="12345678"
            />
            {errors.document_number && <span className="text-xs text-red-500">{errors.document_number}</span>}
          </div>

          {/* Nombres */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombres *</label>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={e => handleChange(e, setFormData, onChangeExtra)}
              placeholder="Juan"
            />
            {errors.first_name && <span className="text-xs text-red-500">{errors.first_name}</span>}
          </div>

          {/* Apellidos */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Apellidos *</label>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={e => handleChange(e, setFormData, onChangeExtra)}
              placeholder="Pérez"
            />
            {errors.last_name && <span className="text-xs text-red-500">{errors.last_name}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Correo Electrónico *</label>
            <Input
              name="email"
              value={formData.email}
              onChange={e => handleChange(e, setFormData, onChangeExtra)}
              placeholder="juan.perez@empresa.com"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
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

          {/* Campos condicionales (solo mostrar si existían en el usuario) */}
          {user?.roleable_type === 'LogisticsUser' || user?.roleable_type === 'Warehouseman' ? (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Cargo / Posición</label>
              <Input
                name="position"
                value={formData.position}
                onChange={e => handleChange(e, setFormData, onChangeExtra)}
                placeholder="Ej. Conductor, Supervisor..."
              />
            </div>
          ) : null}

          {user?.roleable_type === 'Manager' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Área</label>
              <Input
                name="area"
                value={formData.area}
                onChange={e => handleChange(e, setFormData, onChangeExtra)}
                placeholder="Ej. Comercial, Operaciones..."
              />
            </div>
          )}

        </div>
      </Modal>
    )
  )
}

export default UpdateUserModal
