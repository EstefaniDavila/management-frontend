import React from 'react'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEdit } from 'react-icons/tb'
import { TbTrash } from 'react-icons/tb'
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const typeColorVariants = {
  OPEN: 'bg-gray-400 text-gray-800',
  IN_PROGRESS: 'bg-yellow-300 text-green-800',
  COMPLETED: 'bg-red-200 text-yellow-800',
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

const columns = (handleDelete, handleUpdate, handleShowDiagnosis, handleShowActions) => [
  {
    accessorKey: 'code',
    header: 'Código',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorFn: row => row.assigned_to?.full_name,
    header: 'Tecnico Asignado',
    cell: info => info.getValue() || 'Sin tecnico',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'work_order_type',
    header: 'Tipo de Orden',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'scheduled_date',
    header: 'Fecha Programada',
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
    const type = row?.original?.work_order_type

    return (
      <div className='flex space-x-4'>
        <GeneralTooltip
          content='Actualizar Orden de Trabajo'
          triggerContent={
            <span className='bg-yellow-500 text-white rounded-full p-1'>
              <TbEdit size={20}/>
            </span>
          }
          onClick={()=> handleUpdate(row?.original)}
        />
        <GeneralTooltip
          content='Eliminar Orden de Trabajo'
          triggerContent={
            <span className='bg-red-500 text-white rounded-full p-1'>
              <TbTrash size={20}/>
            </span>
          }
          onClick={()=> handleDelete(row?.original.id)}
        />
        {type === "DIAGNOSTIVE" && (
          <GeneralTooltip
            content='Mostrar Diagnóstico'
            triggerContent={
              <span className='bg-green-500 text-white rounded-full p-1'>
                <Eye size={20}/>
              </span>
            }
            onClick={() => handleShowDiagnosis(row?.original)}
          />
        )}
        {["SUPERVISION", "EXECUTION"].includes(type) && (
          <GeneralTooltip
            content='Mostrar Acciones'
            triggerContent={
              <span className='bg-green-500 text-white rounded-full p-1'>
                <Eye size={20}/>
              </span>
            }
            onClick={() => handleShowActions(row?.original)}
          />
        )}
      </div>
    )
  },
}
]

export default columns