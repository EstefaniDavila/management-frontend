import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEdit, TbTrash, TbEye, TbLock } from "react-icons/tb"
import { HiOutlineUserCircle } from "react-icons/hi2"

const statusColor = {
  active:   'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
}

const statusLabel = {
  active:   'Activo',
  inactive: 'Inactivo',
}

const roleLabel = {
  Admin: 'Administrador',
  Advisor: 'Asesor Comercial',
  LogisticsUser: 'Logística',
  Warehouseman: 'Almacenero',
  Manager: 'Jefe de Área',
  Technician: 'Técnico',
}

const columns = (handleView, handleEdit, handleDelete, handleToggleStatus, handleResetPassword) => [
  {
    accessorKey: 'full_name',
    header: 'Nombre',
    cell: info => <span className="font-medium">{info.getValue() || 'Sin nombre'}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'roleable_type',
    header: 'Rol',
    cell: info => <Badge variant="outline">{roleLabel[info.getValue()] || info.getValue()}</Badge>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'email',
    header: 'Correo',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'document_number',
    header: 'N° Documento',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    cell: info => info.getValue() || '-',
    enableColumnFilter: false,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: info => {
      const v = info.getValue() || 'inactive'
      const color = statusColor[v] || 'bg-gray-100 text-gray-800'
      const label = statusLabel[v] || v
      
      return (
        <Badge className={`px-2 py-1 rounded cursor-pointer ${color}`} onClick={() => handleToggleStatus(info.row.original)}>
          {label}
        </Badge>
      )
    },
    enableColumnFilter: true,
  },
  {
    header: 'Acciones',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        {/* <GeneralTooltip
          content="Ver detalle"
          triggerContent={<span className='bg-blue-500 text-white rounded-full p-1 cursor-pointer'><TbEye size={18}/></span>}
          onClick={() => handleView(row.original)}
        /> */}
        <GeneralTooltip
          content="Editar"
          triggerContent={<span className='bg-yellow-500 text-white rounded-full p-1 cursor-pointer'><TbEdit size={18}/></span>}
          onClick={() => handleEdit(row.original)}
        />
        <GeneralTooltip
          content="Resetear Contraseña"
          triggerContent={<span className='bg-indigo-500 text-white rounded-full p-1 cursor-pointer'><TbLock size={18}/></span>}
          onClick={() => handleResetPassword(row.original)}
        />
        <GeneralTooltip
          content="Eliminar"
          triggerContent={<span className='bg-red-500 text-white rounded-full p-1 cursor-pointer'><TbTrash size={18}/></span>}
          onClick={() => handleDelete(row.original)}
        />
      </div>
    ),
  }
]

export default columns
