import React, { useState } from 'react'
import Modal from '@/components/custom/modal'
import { Input } from '@/components/ui/input'
import { handleChange, handleSelectChange } from '@/services/general/handlers'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select'

const initialForm = {
  roleable_type: 'Admin',
  document_type: 'DNI',
  document_number: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  position: '',
  area: '',
}

const CreateUserModal = ({ isOpen, handleClose, onCreate, prefilledData }) => {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  React.useEffect(() => {
    if (isOpen && prefilledData) {
      const allowedRoles = ['Admin', 'Advisor', 'Manager', 'Technician', 'LogisticsUser', 'Warehouseman']
      const prefilledRole = allowedRoles.includes(prefilledData.requested_role) 
        ? prefilledData.requested_role 
        : 'Admin'

      setFormData({
        ...initialForm,
        roleable_type: prefilledRole,
        document_type: prefilledData.document_type || 'DNI',
        document_number: prefilledData.document_number || '',
        first_name: prefilledData.first_name || '',
        last_name: prefilledData.last_name || '',
        email: prefilledData.email || '',
        phone: prefilledData.phone || ''
      })
    } else if (isOpen && !prefilledData) {
      setFormData(initialForm)
    }
  }, [isOpen, prefilledData])

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
    
    // Preparar el payload esperado por el backend
    const { roleable_type, ...role_attributes } = formData
    role_attributes.full_name = `${role_attributes.first_name} ${role_attributes.last_name}`.trim()

    // Eliminar campos que no pertenecen al rol seleccionado para evitar UnknownAttributeError en el backend
    if (roleable_type !== 'Manager') delete role_attributes.area
    if (roleable_type !== 'LogisticsUser' && roleable_type !== 'Warehouseman') delete role_attributes.position
    if (roleable_type !== 'Technician') {
      delete role_attributes.specialty
      delete role_attributes.certification
    }
    if (roleable_type !== 'Advisor') delete role_attributes.commission_rate

    // Eliminar campos vacíos para no enviar strings vacíos que causen errores
    Object.keys(role_attributes).forEach(key => {
      if (role_attributes[key] === '' || role_attributes[key] === null) {
        delete role_attributes[key]
      }
    })

    const payload = {
      roleable_type,
      role_attributes
    }

    onCreate(payload)
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
        title="Nuevo Usuario"
        description="Complete los campos para crear un usuario y asignarle un rol."
        size="md"
        callBack={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">

          {/* Rol */}
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">Rol del Usuario *</label>
            <Select
              value={formData.roleable_type}
              onValueChange={val => handleSelectChange('roleable_type', val, setFormData, onChangeExtra)}
            >
              <SelectTrigger><SelectValue placeholder="Seleccionar Rol..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Administrador</SelectItem>
                <SelectItem value="Advisor">Asesor Comercial</SelectItem>
                <SelectItem value="LogisticsUser">Logística</SelectItem>
                <SelectItem value="Warehouseman">Almacenero</SelectItem>
                <SelectItem value="Manager">Jefe de Área</SelectItem>
                <SelectItem value="Technician">Técnico</SelectItem>
              </SelectContent>
            </Select>
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
              value={formData.first_name} 
              onChange={e => {
                const val = e.target.value
                const first = val.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
                const last = formData.last_name.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
                const email = (first || last) ? `${first}${first && last ? '.' : ''}${last}@erpcat.com` : ''
                setFormData({ ...formData, first_name: val, email })
              }} 
              placeholder="Ejem. Juan" 
            />
            {errors.first_name && <span className="text-red-500 text-xs">{errors.first_name}</span>}
          </div>

          {/* Apellidos */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Apellido(s) *</label>
            <Input 
              value={formData.last_name} 
              onChange={e => {
                const val = e.target.value
                const first = formData.first_name.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
                const last = val.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
                const email = (first || last) ? `${first}${first && last ? '.' : ''}${last}@erpcat.com` : ''
                setFormData({ ...formData, last_name: val, email })
              }} 
              placeholder="Ejem. Pérez" 
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

          {/* Campos condicionales */}
          {['LogisticsUser', 'Warehouseman'].includes(formData.roleable_type) && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Cargo / Posición</label>
              <Input
                name="position"
                value={formData.position}
                onChange={e => handleChange(e, setFormData, onChangeExtra)}
                placeholder="Ej. Conductor, Supervisor..."
              />
            </div>
          )}

          {formData.roleable_type === 'Manager' && (
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

export default CreateUserModal
