import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbFileInvoice, TbEye } from 'react-icons/tb'

const typeLabel = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const statusColor = {
  new:       'bg-purple-100 text-purple-800',
  assigned:  'bg-blue-100 text-blue-800',
  contacted: 'bg-orange-100 text-orange-800',
  converted: 'bg-green-100 text-green-800',
  discarded: 'bg-red-100 text-red-800',
  pending:   'bg-yellow-100 text-yellow-800',
}

const statusLabel = {
  new:       'Nuevo',
  assigned:  'Asignado',
  contacted: 'Contactado',
  converted: 'Convertido',
  discarded: 'Descartado',
  pending:   'Pendiente',
}

const statusTooltip = {
  new:       'Lead recién ingresado, requiere ser revisado',
  assigned:  'Lead asignado al asesor',
  contacted: 'El asesor ya contactó al cliente',
  converted: 'Lead convertido a cotización / cliente activo',
  discarded: 'Lead rechazado o no interesado',
  pending:   'Lead en espera de seguimiento',
}

const columns = (handleView, handleConvert, currentAdvisor) => [
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
    accessorKey: 'description',
    header: 'Descripción',
    cell: info => <span className="text-xs text-muted-foreground line-clamp-1">{info.getValue()}</span>,
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
      const v = info.getValue() || 'pending'
      const color = statusColor[v] || 'bg-gray-100 text-gray-800'
      const label = statusLabel[v] || v
      const tooltip = statusTooltip[v] || 'Estado actual del lead'
      
      return (
        <GeneralTooltip
          content={tooltip}
          triggerContent={
            <Badge className={`px-2 py-1 text-xs cursor-help ${color}`}>
              {label}
            </Badge>
          }
        />
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
          {row.original.quotation_id && (
            <GeneralTooltip
              content="Ver cotización"
              triggerContent={<span className="bg-green-500 text-white rounded-full p-1"><TbFileInvoice size={18}/></span>}
              onClick={() => handleConvert(row.original)}
            />
          )}
        </div>
      )
    },
  },
]

export default columns