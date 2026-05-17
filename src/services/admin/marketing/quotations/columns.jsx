import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEdit, TbTrash, TbEye, TbCheck, TbX } from "react-icons/tb"

const statusColor = {
  Pending:          'bg-yellow-100 text-yellow-800',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  Approved:         'bg-green-100 text-green-800',
  approved:         'bg-green-100 text-green-800',
  Rejected:         'bg-red-100 text-red-800',
  rejected:         'bg-red-100 text-red-800',
  draft:            'bg-gray-100 text-gray-800',
  sent:             'bg-blue-100 text-blue-800',
}

const statusLabel = {
  Pending:          'Pendiente',
  pending_approval: 'Pendiente',
  Approved:         'Aprobado',
  approved:         'Aprobado',
  Rejected:         'Rechazado',
  rejected:         'Rechazado',
  draft:            'Borrador',
  sent:             'Enviado',
}

const statusTooltip = {
  Pending:          'Cotización en espera de revisión por la gerencia',
  pending_approval: 'Cotización en espera de revisión por la gerencia',
  Approved:         'Cotización aprobada',
  approved:         'Cotización aprobada',
  Rejected:         'Cotización rechazada',
  rejected:         'Cotización rechazada',
  draft:            'Borrador en edición por el asesor',
  sent:             'Cotización enviada al cliente',
}

const typeLabels = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const columns = (handleView, handleApprove, handleReject, handleDelete, handleEdit) => [
  {
    accessorKey: 'code',
    header: 'Código',
    cell: info => <span className="font-mono text-xs">{info.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'customer',
    header: 'Cliente',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'quotation_type',
    header: 'Tipo',
    cell: info => typeLabels[info.getValue()] || info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'equipment',
    header: 'Ítem',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'advisor',
    header: 'Asesor',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'amount',
    header: 'Monto (S/)',
    cell: info => `S/ ${Number(info.getValue()).toLocaleString()}`,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'date',
    header: 'Fecha',
    cell: info => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: info => {
      const v = info.getValue() || 'draft'
      const color = statusColor[v] || 'bg-gray-100 text-gray-800'
      const label = statusLabel[v] || v
      const tooltip = statusTooltip[v] || 'Estado actual de la cotización'

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
    cell: ({ row }) => {
      const status = row.original.status
      const isPending = status === 'Pending'

      return (
        <div className="flex space-x-2">
          {/* Ver siempre */}
          <GeneralTooltip
            content="Ver detalle"
            triggerContent={<span className='bg-blue-500 text-white rounded-full p-1'><TbEye size={18}/></span>}
            onClick={() => handleView(row.original)}
          />

          {/* Editar solo si Pending */}
          {isPending && (
            <GeneralTooltip
              content="Editar"
              triggerContent={<span className='bg-yellow-500 text-white rounded-full p-1'><TbEdit size={18}/></span>}
              onClick={() => handleEdit(row.original)}
            />
          )}

          {isPending && (
            <GeneralTooltip
              content="Aprobar"
              triggerContent={<span className='bg-green-500 text-white rounded-full p-1'><TbCheck size={18}/></span>}
              onClick={() => handleApprove(row.original)}
            />
          )}

          {isPending && (
            <GeneralTooltip
              content="Rechazar"
              triggerContent={<span className='bg-orange-500 text-white rounded-full p-1'><TbX size={18}/></span>}
              onClick={() => handleReject(row.original)}
            />
          )}

          {isPending && (
            <GeneralTooltip
              content="Eliminar"
              triggerContent={<span className='bg-red-500 text-white rounded-full p-1'><TbTrash size={18}/></span>}
              onClick={() => handleDelete(row.original.id)}
            />
          )}
        </div>
      )
    },
  }
]

export default columns