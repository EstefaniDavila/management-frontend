import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEdit, TbTrash, TbEye, TbCheck, TbX } from "react-icons/tb"

const statusColor = {
  Pending:  'bg-yellow-200 text-yellow-800',
  Approved: 'bg-green-200 text-green-800',
  Rejected: 'bg-red-200 text-red-800',
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
      const value = info.getValue()
      return <Badge className={`px-2 py-1 rounded ${statusColor[value]}`}>{value}</Badge>
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