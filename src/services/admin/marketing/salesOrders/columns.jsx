import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEye, TbEdit, TbTrash } from 'react-icons/tb'

const statusColor = {
  pending:          'bg-yellow-100 text-yellow-800',
  pending_dispatch: 'bg-orange-100 text-orange-800',
  dispatched:       'bg-blue-100 text-blue-800',
  delivered:        'bg-green-100 text-green-800',
}

const statusLabel = {
  pending:          'Pendiente',
  pending_dispatch: 'Pend. Despacho',
  dispatched:       'Despachado',
  delivered:        'Entregado',
}

const typeLabels = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const columns = (handleView, handleEdit, handleDelete) => [
  {
    accessorKey: 'code',
    header: 'Código',
    cell: info => <span className="font-mono text-xs">{info.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'customer',
    header: 'Cliente',
    cell: info => <span className="font-medium">{info.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'order_type',
    header: 'Tipo',
    cell: info => typeLabels[info.getValue()] || info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'item_description',
    header: 'Ítem',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'advisor',
    header: 'Asesor',
    cell: info => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'amount',
    header: 'Monto (S/)',
    cell: info => `S/ ${info.getValue().toLocaleString()}`,
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
      return (
        <Badge className={`px-2 py-1 rounded ${statusColor[value] || 'bg-gray-100 text-gray-800'}`}>
          {statusLabel[value] || value}
        </Badge>
      )
    },
    enableColumnFilter: false,
  },
  {
  header: 'Acciones',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <div className="flex space-x-2">
          <GeneralTooltip
            content="Ver detalle"
            triggerContent={<span className="bg-blue-500 text-white rounded-full p-1"><TbEye size={18}/></span>}
            onClick={() => handleView(row.original)}
          />
          {status !== 'delivered' && (
            <GeneralTooltip
              content="Actualizar estado"
              triggerContent={<span className="bg-yellow-500 text-white rounded-full p-1"><TbEdit size={18}/></span>}
              onClick={() => handleEdit(row.original)}
            />
          )}
          {status === 'pending' && (
            <GeneralTooltip
              content="Eliminar"
              triggerContent={<span className="bg-red-500 text-white rounded-full p-1"><TbTrash size={18}/></span>}
              onClick={() => handleDelete(row.original)}
            />
          )}
        </div>
      )
    },
  }
]

export default columns