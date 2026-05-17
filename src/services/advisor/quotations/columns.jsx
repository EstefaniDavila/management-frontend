import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEye, TbSend, TbCheck, TbX, TbArrowForward, TbMessage } from 'react-icons/tb'

const typeLabel = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const statusColor = {
  draft:            'bg-gray-100 text-gray-700 border border-gray-200',
  sent:             'bg-blue-100 text-blue-800 border border-blue-200',
  pending_approval: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  pending:          'bg-yellow-100 text-yellow-800 border border-yellow-200',
  approved:         'bg-green-100 text-green-800 border border-green-200',
  rejected:         'bg-red-100 text-red-800 border border-red-200',
  pending_area_review: 'bg-orange-100 text-orange-800 border border-orange-200',
  client_approved:  'bg-teal-100 text-teal-800 border border-teal-200',
  client_rejected:  'bg-rose-100 text-rose-800 border border-rose-200',
}

const statusLabel = {
  draft:            'Borrador',
  sent:             'Enviada',
  pending_approval: 'Enviada como Solicitud',
  pending:          'Pendiente',
  approved:         'Aprobada',
  rejected:         'Rechazada',
  pending_area_review: 'En Área...',
  client_approved:  'Aprobada por Cliente',
  client_rejected:  'Rechazada por Cliente',
}

const statusTooltip = {
  draft:            'Borrador (Aún se puede verificar y editar)',
  sent:             'Cotización enviada al cliente',
  pending_approval: 'Enviada al gerente como solicitud de aprobación',
  pending:          'Cotización web pendiente de validación y aprobación',
  approved:         'Cotización aprobada',
  rejected:         'Cotización rechazada',
  pending_area_review: 'Cotización en revisión técnica por el área especializada',
  client_approved:  'Cotización aprobada por el cliente; lista para el Gerente',
  client_rejected:  'Cotización rechazada por el cliente',
}

const columns = (handleView, handleSend, handleApprove, handleReject, handleSendToArea, handleSendToClient) => [
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
      const v = info.getValue() || 'draft'
      const color = statusColor[v] || 'bg-gray-100 text-gray-800'
      const label = statusLabel[v] || v
      const tooltip = statusTooltip[v] || 'Estado actual de la cotización'
      
      const { has_completed_area_request, pending_area_request, quotation_type } = info.row.original
      const isRentalOrMaint = quotation_type === 'rental' || quotation_type === 'maintenance'

      return (
        <div className="flex flex-col gap-1 items-start">
          <GeneralTooltip
            content={tooltip}
            triggerContent={
              <Badge className={`px-2 py-1 text-xs cursor-help ${color}`}>
                {label}
              </Badge>
            }
          />
          {isRentalOrMaint && (
            has_completed_area_request ? (
              <span className="text-[9px] text-green-600 font-semibold bg-green-50 px-1 py-0.5 rounded border border-green-200">✓ Área Aprobó</span>
            ) : pending_area_request ? (
              <span className="text-[9px] text-orange-600 font-semibold bg-orange-50 px-1 py-0.5 rounded border border-orange-200">⏳ En Área...</span>
            ) : (
              <span className="text-[9px] text-red-600 font-semibold bg-red-50 px-1 py-0.5 rounded border border-red-200">⚠ Enviar a Área</span>
            )
          )}
        </div>
      )
    },
    enableColumnFilter: false,
  },
  {
    header: 'Acciones',
    cell: ({ row }) => {
      const { status, quotation_type, has_completed_area_request, pending_area_request } = row.original
      const isRentalOrMaint = quotation_type === 'rental' || quotation_type === 'maintenance'
      return (
        <div className="flex space-x-2">
          <GeneralTooltip
            content="Ver detalle"
            triggerContent={<span className="bg-blue-500 text-white rounded-full p-1"><TbEye size={18}/></span>}
            onClick={() => handleView(row.original)}
          />
          {/* DRAFT/PENDING: Lógica de botones según tipo y estado del área */}
          {(status === 'draft' || status === 'pending' || status === 'pending_area_review') && (
            isRentalOrMaint ? (
              !has_completed_area_request ? (
                // Área aún no ha revisado: mostrar "Enviar a Área" si no hay solicitud pendiente
                !pending_area_request && (
                  <GeneralTooltip
                    content="Enviar a Área Especializada"
                    triggerContent={<span className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-1"><TbArrowForward size={18}/></span>}
                    onClick={() => handleSendToArea(row.original)}
                  />
                )
              ) : (
                // Área ya completó: mostrar botón "Enviar al Cliente"
                <GeneralTooltip
                  content="Enviar Cotización al Cliente"
                  triggerContent={<span className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-1"><TbMessage size={18}/></span>}
                  onClick={() => handleSendToClient && handleSendToClient(row.original.id)}
                />
              )
            ) : (
              // Ventas estándar: enviar al cliente primero
              <GeneralTooltip
                content="Enviar Cotización al Cliente"
                triggerContent={<span className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-1"><TbMessage size={18}/></span>}
                onClick={() => handleSendToClient && handleSendToClient(row.original.id)}
              />
            )
          )}
          {/* CLIENT APPROVED: el cliente ya aprobó - asesor puede enviarla al gerente para la aprobación final */}
          {status === 'client_approved' && (
            <GeneralTooltip
              content="Enviar al Gerente para Aprobación"
              triggerContent={<span className="bg-purple-500 text-white rounded-full p-1"><TbSend size={18}/></span>}
              onClick={() => handleSend(row.original.id)}
            />
          )}
          {/* Simula o realiza aprobación/rechazo de cotizaciones */}
          {(status === 'pending' || status === 'sent') && (
            <>
              <GeneralTooltip
                content={status === 'pending' ? "Aprobar cotización" : "Simular: Cliente aprueba"}
                triggerContent={<span className="bg-green-500 text-white rounded-full p-1"><TbCheck size={18}/></span>}
                onClick={() => handleApprove(row.original)}
              />
              <GeneralTooltip
                content={status === 'pending' ? "Rechazar cotización" : "Simular: Cliente rechaza"}
                triggerContent={<span className="bg-red-500 text-white rounded-full p-1"><TbX size={18}/></span>}
                onClick={() => handleReject(row.original)}
              />
            </>
          )}
        </div>
      )
    },
  },
]

export default columns