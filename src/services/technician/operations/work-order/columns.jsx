import React from 'react'
import GeneralTooltip from '@/helpers/generalTooltip'
import { Eye } from 'lucide-react';
import { GiNotebook } from "react-icons/gi";
import { Badge } from '@/components/ui/badge';

const typeColorVariants = {
  OPEN: 'bg-green-300 text-green-800',
  IN_PROGRESS: 'bg-yellow-200 text-yellow-800',
  CLOSED: 'bg-red-200 text-red-800',
  DRAFT: 'bg-blue-200 text-blue-800'
}

const statusVariants = {
  EXECUTION: "EJECUCIÓN",
  DIAGNOSTIVE: "DIAGNOSTICO",
  SUPERVISION: "SUPERVISION",
}

const formatDate = (dateString) => {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

const columns = (handleShow, handleBuild, handleResume) => [
  {
    accessorKey: 'code',
    header: 'Código',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorFn: row => row.maintenance?.client?.business_name,
    header: 'Cliente',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorFn: row => row.maintenance?.enterprise_vehicle?.product?.name,
    header: 'Equipo',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'work_order_type',
    header: 'Tipo de Orden de Trabajo',
    cell: info => statusVariants[info.getValue()] || info.getValue(),
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
    accessorKey: 'scheduled_date',
    header: 'Fecha Programada',
    cell: info => formatDate(info.getValue()),
    enableColumnFilter: true,
  },
  {
  header: 'Acciones',
  cell: ({ row }) => {
    const status = row?.original?.status

    return (
      <div className='flex space-x-4'>
        {["OPEN", "IN_PROGRESS"].includes(status) && (
          <GeneralTooltip
            content='Procesar Mantenimiento'
            triggerContent={
              <span className='bg-green-500 text-white rounded-full p-1'>
                <GiNotebook size={20}/>
              </span>
            }
            onClick={()=> handleBuild(row?.original, 'edit')}
          />
        )}
        {/* {status === "OPEN" && (
          <GeneralTooltip
            content='Revisar Mantenimiento'
            triggerContent={
              <span className='bg-yellow-500 text-white rounded-full p-1'>
                <Eye size={20}/>
              </span>
            }
            onClick={()=> handleShow(row?.original, 'edit')}
          />
        )} */}
        {/* {status === "CLOSED" && (
          <GeneralTooltip
            content='Resumen Orden de Trabajo'
            triggerContent={
              <span className='bg-red-500 text-white rounded-full p-1'>
                <Eye size={20}/>
              </span>
            }
            onClick={()=> handleResume(row?.original, 'resume')}
          />
        )} */}
      </div>
    )
  },
}
]

export default columns