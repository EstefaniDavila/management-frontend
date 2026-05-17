import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEye, TbSend, TbCheck, TbX } from 'react-icons/tb'

const typeLabel = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const statusColor = {
  draft:              'bg-gray-100 text-gray-700',
  sent:               'bg-blue-100 text-blue-800',
  approved:           'bg-green-100 text-green-800',
  approved_internally:'bg-teal-100 text-teal-800',
  rejected:           'bg-red-100 text-red-800',
  client_approved:    'bg-purple-100 text-purple-800',
  pending_approval:   'bg-amber-100 text-amber-800',
}

const statusLabel = {
  draft:               'Borrador',
  sent:                'Enviada al Cliente',
  approved:            'Aprobada Definitivamente',
  approved_internally: 'Aprobada Internamente',
  rejected:            'Rechazada',
  client_approved:     '✅ Cliente Aprobó',
  pending_approval:    '⏳ Pendiente Aprobación Final',
}

const columns = (handleView, handleSend, handleApprove, handleReject, handleFinalApprove) => [
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
    accessorKey: 'equipment',
    header: 'Equipo / Servicio',
    cell: info => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'quotation_type',
    header: 'Tipo',
    cell: info => typeLabel[info.getValue()] || info.getValue(),
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
      const v = info.getValue()
      return <Badge className={`px-2 py-1 text-xs ${statusColor[v]}`}>{statusLabel[v]}</Badge>
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
          {status === 'draft' && (
            <GeneralTooltip
              content="Enviar al cliente"
              triggerContent={<span className="bg-purple-500 text-white rounded-full p-1"><TbSend size={18}/></span>}
              onClick={() => handleSend(row.original.id)}
            />
          )}
          {/* Simula respuesta del cliente — en producción esto vendría del backend */}
          {status === 'sent' && (
            <>
              <GeneralTooltip
                content="Simular: Cliente aprueba"
                triggerContent={<span className="bg-green-500 text-white rounded-full p-1"><TbCheck size={18}/></span>}
                onClick={() => handleApprove(row.original)}
              />
              <GeneralTooltip
                content="Simular: Cliente rechaza"
                triggerContent={<span className="bg-red-500 text-white rounded-full p-1"><TbX size={18}/></span>}
                onClick={() => handleReject(row.original.id)}
              />
            </>
          )}
          {/* Aprobación Final: cuando el cliente ya aprobó, el gerente puede dar OK definitivo */}
          {(status === 'client_approved' || status === 'pending_approval') && (
            <>
              <GeneralTooltip
                content="✅ Aprobación Final → Generar Orden"
                triggerContent={<span className="bg-emerald-600 text-white rounded-full p-1"><TbCheck size={18}/></span>}
                onClick={() => handleFinalApprove && handleFinalApprove(row.original.id)}
              />
              <GeneralTooltip
                content="Rechazar"
                triggerContent={<span className="bg-red-500 text-white rounded-full p-1"><TbX size={18}/></span>}
                onClick={() => handleReject(row.original.id)}
              />
            </>
          )}
        </div>
      )
    },
  },
]

export default columns