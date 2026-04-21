import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEye, TbUserCheck } from 'react-icons/tb'

const typeLabel = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const statusColor = {
  pending:   'bg-yellow-100 text-yellow-800',
  assigned:  'bg-blue-100 text-blue-800',
  converted: 'bg-green-100 text-green-800',
}

const statusLabel = {
  pending:   'Pendiente',
  assigned:  'Asignado',
  converted: 'Convertido',
}

const columns = (handleView, handleAssign) => [
  {
    accessorKey: 'company',
    header: 'Empresa',
    cell: info => <span className="font-medium">{info.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'name',
    header: 'Contacto',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'request_type',
    header: 'Tipo',
    cell: info => typeLabel[info.getValue()] || info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'assigned_to',
    header: 'Asesor',
    cell: info => info.getValue()
      ? <span className="text-blue-600 text-xs font-medium">{info.getValue()}</span>
      : <span className="text-muted-foreground text-xs">Sin asignar</span>,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'created_at',
    header: 'Fecha',
    cell: info => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: info => {
      const v = info.getValue()
      return (
        <Badge className={`px-2 py-1 text-xs ${statusColor[v]}`}>
          {statusLabel[v]}
        </Badge>
      )
    },
    enableColumnFilter: false,
  },
  {
    header: 'Acciones',
    cell: ({ row }) => {
      const { status } = row.original
      return (
        <div className="flex space-x-2">
          <GeneralTooltip
            content="Ver detalle"
            triggerContent={<span className="bg-blue-500 text-white rounded-full p-1"><TbEye size={18}/></span>}
            onClick={() => handleView(row.original)}
          />
          {status !== 'converted' && (
            <GeneralTooltip
              content={status === 'assigned' ? 'Reasignar asesor' : 'Asignar asesor'}
              triggerContent={<span className="bg-green-500 text-white rounded-full p-1"><TbUserCheck size={18}/></span>}
              onClick={() => handleAssign(row.original)}
            />
          )}
        </div>
      )
    },
  },
]

export default columns