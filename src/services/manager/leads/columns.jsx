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
  pending:     'bg-yellow-100 text-yellow-800',
  new:         'bg-purple-100 text-purple-800',
  assigned:    'bg-blue-100 text-blue-800',
  in_progress: 'bg-orange-100 text-orange-800',
  converted:   'bg-green-100 text-green-800',
  lost:        'bg-gray-100 text-gray-800',
}

const statusLabel = {
  pending:     'Pendiente',
  new:         'Nuevo / Web',
  assigned:    'Asignado',
  in_progress: 'En Proceso',
  converted:   'Convertido',
  lost:        'Perdido',
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
      ? <span className="text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-1 rounded">{info.getValue()}</span>
      : <span className="text-muted-foreground text-xs bg-gray-50 px-2 py-1 rounded">Sin asignar</span>,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'created_at',
    header: 'Fecha',
    cell: info => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'priority',
    header: 'Prioridad',
    cell: info => {
      const v = info.getValue() || 'NC'
      const labels = { 
        NC:          'Cliente Nuevo',
        CP:          'Cliente Potencial',
        NN:          'No Deseado',
        NH:          'Cliente Histórico',
        new_client:  'Cliente Nuevo',
        potential:   'Cliente Potencial',
        undesirable: 'No Deseado',
        historical:  'Cliente Histórico',
        high:        'Alta', 
        medium:      'Media', 
        low:         'Baja',
        CN:          'CN (No Deseado)', 
        CR:          'CR (Reciclado)' 
      }
      const colors = { 
        NC:          'bg-purple-100 text-purple-800 border-purple-200',
        CP:          'bg-yellow-100 text-yellow-800 border-yellow-200',
        NN:          'bg-red-100 text-red-800 border-red-200',
        NH:          'bg-blue-100 text-blue-800 border-blue-200',
        new_client:  'bg-purple-100 text-purple-800 border-purple-200',
        potential:   'bg-yellow-100 text-yellow-800 border-yellow-200',
        undesirable: 'bg-red-100 text-red-800 border-red-200',
        historical:  'bg-blue-100 text-blue-800 border-blue-200',
        high:        'bg-red-100 text-red-800 border-red-200', 
        medium:      'bg-yellow-100 text-yellow-800 border-yellow-200', 
        low:         'bg-blue-100 text-blue-800 border-blue-200',
        CN:          'bg-red-100 text-red-800', 
        CP:          'bg-yellow-100 text-yellow-800', 
        CR:          'bg-blue-100 text-blue-800' 
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
      const v = info.getValue() || 'new'
      return (
        <Badge className={`px-2 py-1 text-xs font-bold ${statusColor[v] || 'bg-gray-100 text-gray-800'}`}>
          {statusLabel[v] || v}
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