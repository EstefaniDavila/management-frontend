import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEdit, TbTrash, TbEye } from "react-icons/tb"

const statusColor = {
  active:   'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  blocked:  'bg-red-100 text-red-800',
}

const statusLabel = {
  active:   'Activo',
  inactive: 'Inactivo',
  blocked:  'Bloqueado',
}

const statusTooltip = {
  active:   'Cliente habilitado para nuevas cotizaciones y operaciones',
  inactive: 'Cliente dado de baja temporalmente',
  blocked:  'Cliente bloqueado en el sistema',
}

const typeLabels = {
  construccion: 'Construcción',
  mineria:      'Minería',
  transporte:   'Transporte',
  energia:      'Energía',
}

const columns = (handleView, handleEdit, handleDelete) => [
  {
    accessorKey: 'code',
    header: 'Código',
    cell: info => <span className="font-mono text-xs">{info.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'business_name',
    header: 'Razón Social',
    cell: info => <span className="font-medium">{info.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'document_type',
    header: 'Tipo Doc.',
    cell: info => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'document_number',
    header: 'N° Documento',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'contact_name',
    header: 'Contacto',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    cell: info => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'email',
    header: 'Correo',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'type',
    header: 'Rubro',
    cell: info => typeLabels[info.getValue()] || info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'priority',
    header: 'Prioridad',
    cell: info => {
      const v = info.getValue() || 'NC'
      const labels = { 
        NC: 'NC (Cliente Nuevo)', 
        CP: 'CP (Potencial)', 
        NN: 'CN (No Deseado)', 
        NH: 'CH (Histórico)',
        CN: 'CN (No Deseado)', 
        CR: 'CR (Reciclado)' 
      }
      const colors = { 
        NC: 'bg-purple-100 text-purple-800 border-purple-200', 
        CP: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        NN: 'bg-red-100 text-red-800 border-red-200', 
        NH: 'bg-blue-100 text-blue-800 border-blue-200',
        CN: 'bg-red-100 text-red-800', 
        CR: 'bg-blue-100 text-blue-800' 
      }
      return (
        <Badge className={`px-2 py-0.5 text-[10px] font-semibold border ${colors[v] || 'bg-gray-100 text-gray-800'}`}>
          {labels[v] || v}
        </Badge>
      )
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: info => {
      const v = info.getValue() || 'inactive'
      const color = statusColor[v] || 'bg-gray-100 text-gray-800'
      const label = statusLabel[v] || v
      const tooltip = statusTooltip[v] || 'Estado actual del cliente'
      
      return (
        <GeneralTooltip
          content={tooltip}
          triggerContent={
            <Badge className={`px-2 py-1 rounded cursor-help ${color}`}>
              {label}
            </Badge>
          }
        />
      )
    },
    enableColumnFilter: true,
  },
  {
    header: 'Acciones',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <GeneralTooltip
          content="Ver detalle"
          triggerContent={<span className='bg-blue-500 text-white rounded-full p-1'><TbEye size={18}/></span>}
          onClick={() => handleView(row.original)}
        />
        <GeneralTooltip
          content="Editar"
          triggerContent={<span className='bg-yellow-500 text-white rounded-full p-1'><TbEdit size={18}/></span>}
          onClick={() => handleEdit(row.original)}
        />
        <GeneralTooltip
          content="Eliminar"
          triggerContent={<span className='bg-red-500 text-white rounded-full p-1'><TbTrash size={18}/></span>}
          onClick={() => handleDelete(row.original)}
        />
      </div>
    ),
  }
]

export default columns