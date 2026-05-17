import React from 'react'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEdit } from 'react-icons/tb'
import { TbTrash } from 'react-icons/tb'
import { GiNotebook } from "react-icons/gi";
import { Badge } from '@/components/ui/badge';

const typeColorVariants = {
  PENDING: 'bg-gray-400 text-gray-800',
  COMPLETED: 'bg-green-300 text-green-800',
  IN_PROGRESS: 'bg-yellow-200 text-yellow-800',
  hidden: 'bg-red-200 text-red-800',
  visible: 'bg-blue-200 text-blue-800'
}

const formatDate = (dateString) => {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const columns = (handleBuild) => [
  {
    accessorKey: 'code',
    header: 'Código',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorFn: row => row.client?.business_name,
    header: 'Cliente',
    cell: info => info.getValue() || 'Sin cliente',
    enableColumnFilter: true,
  },
  {
    accessorFn: row => row.enterprise_vehicle?.serial,
    header: 'Equipo',
    cell: info => info.getValue() || 'Sin equipo',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'maintenance_type',
    header: 'Tipo de Mantenimiento',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'scheduled_at',
    header: 'Fecha',
    cell: info => formatDate(info.getValue()),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: info => {
      const value = info.getValue()
      const colorVariant = typeColorVariants[value] || 'bg-gray-300 text-gray-800'
      return (
        <Badge className={`px-2 py-1 rounded ${colorVariant}`}>
          {value.toUpperCase()}
        </Badge>
      )
    },
    enableColumnFilter: true,
  },
  {
  header: 'Acciones',
  cell: ({ row }) => {
    const status = row?.original?.status

    return (
      <div className='flex space-x-4'>
        {status === "PENDING" && (
          <GeneralTooltip
            content='Procesar Mantenimiento'
            triggerContent={
              <span className='bg-green-500 text-white rounded-full p-1'>
                <GiNotebook size={20}/>
              </span>
            }
            onClick={()=> handleBuild(row?.original)}
          />
        )}
        {/* <GeneralTooltip
          content='Eliminar Categoria'
          triggerContent={
            <span className='bg-red-500 text-white rounded-full p-1'>
              <TbTrash size={20}/>
            </span>
          }
          onClick={()=> handleDelete(row?.original.id)}
        /> */}
      </div>
    )
  },
}
]

export default columns