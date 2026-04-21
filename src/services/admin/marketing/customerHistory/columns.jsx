import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEye } from 'react-icons/tb'

const statusColor = {
  active:   'bg-green-200 text-green-800',
  inactive: 'bg-gray-200 text-gray-800',
}

const typeLabels = {
  construccion: 'Construcción',
  mineria:      'Minería',
  transporte:   'Transporte',
  energia:      'Energía',
}

const columns = (handleView) => [
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
    accessorKey: 'type',
    header: 'Rubro',
    cell: info => typeLabels[info.getValue()] || info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: info => {
      const value = info.getValue()
      return (
        <Badge className={`px-2 py-1 rounded ${statusColor[value]}`}>
          {value === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    enableColumnFilter: false,
  },
  {
    header: 'Acciones',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <GeneralTooltip
          content="Ver historial"
          triggerContent={
            <span className='bg-blue-500 text-white rounded-full p-1'>
              <TbEye size={18}/>
            </span>
          }
          onClick={() => handleView(row.original)}
        />
      </div>
    ),
  }
]

export default columns