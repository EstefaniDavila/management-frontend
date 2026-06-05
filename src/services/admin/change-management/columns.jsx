import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEye, TbTrash, TbEdit } from "react-icons/tb"

const severityColor = {
  critical: 'bg-red-600 hover:bg-red-600 text-white',
  high: 'bg-orange-500 hover:bg-orange-500 text-white',
  medium: 'bg-yellow-500 hover:bg-yellow-500 text-black',
  low: 'bg-blue-500 hover:bg-blue-500 text-white',
}

const severityLabel = {
  critical: 'Crítica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
}

const statusColor = {
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
}

const statusLabel = {
  accepted: 'Aceptado',
  rejected: 'Rechazado',
  pending: 'Pendiente',
}

const changeTypeLabel = {
  emergency: 'Emergencia',
  standard: 'Estándar',
  minor: 'Menor',
  major: 'Mayor',
}

const columns = (handleView, handleReview, handleDelete) => [
  {
    accessorKey: 'change_code',
    header: 'Código',
    cell: info => {
      const val = info.getValue() || (info.row.original.id ? `ERR-${info.row.original.id}` : 'PENDIENTE')
      return <span className="font-semibold text-xs tracking-wider">{val}</span>
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: 'title',
    header: 'Título',
    cell: info => <span className="font-medium text-sm line-clamp-1">{info.getValue() || 'Sin título'}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'module_affected',
    header: 'Módulo',
    cell: info => <span className="capitalize text-xs font-semibold">{info.getValue() || '-'}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'severity',
    header: 'Severidad',
    cell: info => {
      const val = info.getValue() || 'medium'
      return <Badge className={`text-xs px-2 py-0.5 rounded ${severityColor[val] || 'bg-gray-500'}`}>{severityLabel[val] || val}</Badge>
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: 'change_type',
    header: 'Tipo',
    cell: info => <span className="text-xs font-medium">{changeTypeLabel[info.getValue()] || info.getValue() || 'No asignado'}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: info => {
      const val = info.getValue() || 'pending'
      const color = statusColor[val] || 'bg-gray-100 text-gray-800'
      const label = statusLabel[val] || 'Pendiente'
      return <Badge className={`px-2 py-0.5 text-xs rounded border ${color}`}>{label}</Badge>
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: 'created_at',
    header: 'Fecha',
    cell: info => {
      const dateVal = info.getValue()
      if (!dateVal) return '-'
      return new Date(dateVal).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    enableColumnFilter: false,
  },
  {
    header: 'Acciones',
    cell: ({ row }) => {
      const change = row.original
      const isPending = change.status === 'pending'

      return (
        <div className="flex space-x-2">
          {/*<GeneralTooltip
          content="Ver detalle"
          triggerContent={<span className='bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600 block'><TbEye size={18}/></span>}
          onClick={() => handleView(change)}
        />*/}

          {isPending && (
            <GeneralTooltip
              content="Evaluar / Revisar"
              triggerContent={<span className='bg-yellow-500 text-white rounded-full p-1 cursor-pointer hover:bg-yellow-600 block'><TbEdit size={18} /></span>}
              onClick={() => handleReview(change)}
            />
          )}

          {/* <GeneralTooltip
          content="Eliminar"
          triggerContent={<span className='bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600 block'><TbTrash size={18}/></span>}
          onClick={() => handleDelete(change)}
       /> */}
        </div>
      )
    },
  }
]

export default columns
