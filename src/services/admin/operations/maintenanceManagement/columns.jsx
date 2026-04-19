import React from 'react'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEdit } from 'react-icons/tb'
import { TbTrash } from 'react-icons/tb'
import { GiNotebook } from "react-icons/gi";
import { Badge } from '@/components/ui/badge';

const typeColorVariants = {
  Pendiente: 'bg-gray-200 text-gray-800',
  Completado: 'bg-green-300 text-green-800',
  "En proceso": 'bg-yellow-200 text-yellow-800',
  hidden: 'bg-red-200 text-red-800',
  visible: 'bg-blue-200 text-blue-800'
}

const columns = (handleDelete, handleUpdate) => [
  {
    accessorKey: 'code',
    header: 'Código',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'customer',
    header: 'Cliente',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'equipment',
    header: 'Equipo',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'maintenance_type',
    header: 'Tipo de Mantenimiento',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'technician',
    header: 'Técnico',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'date',
    header: 'Fecha',
    cell: info => info.getValue(),
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
        {status === "Pendiente" && (
          <GeneralTooltip
            content='Procesar Mantenimiento'
            triggerContent={
              <span className='bg-green-500 text-white rounded-full p-1'>
                <GiNotebook size={20}/>
              </span>
            }
            onClick={()=> handleUpdate(row?.original, 'edit')}
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