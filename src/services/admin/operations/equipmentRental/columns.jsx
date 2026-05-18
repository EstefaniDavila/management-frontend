import React from 'react'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEdit } from 'react-icons/tb'
import { TbTrash } from 'react-icons/tb'
import { GiNotebook } from "react-icons/gi";
import { Badge } from '@/components/ui/badge';

const typeColorVariants = {
  DRAFT: 'bg-gray-400 text-gray-800',
  PENDING: 'bg-green-300 text-green-800',
  DELIVERED: 'bg-yellow-200 text-yellow-800',
  RETURNED: 'bg-red-200 text-red-800',
}

const formatDate = (dateString) => {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const columns = (handleDelete, handleDeliver) => [
  {
    accessorKey: 'code',
    header: 'CODIGO',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorFn: row => row.client?.business_name,
    header: 'Cliente',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorFn: row => row.vehicle?.product?.name,
    header: 'Equipo Rentado',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'delivery_date',
    header: 'Fecha Entrega',
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
        {["DRAFT"].includes(status) && (
          <>
            {/* <GeneralTooltip
              content='Editar Renta'
              triggerContent={
                <span className='bg-yellow-500 text-white rounded-full p-1'>
                  <TbEdit size={20}/>
                </span>
              }
              onClick={()=> handleBuild(row?.original)}
            /> */}
            <GeneralTooltip
              content='Eliminar Renta'
              triggerContent={
                <span className='bg-red-500 text-white rounded-full p-1'>
                  <TbTrash size={20}/>
                </span>
              }
              onClick={()=> handleDelete(row?.original?.id)}
            />
            <GeneralTooltip
              content='Crear Despacho'
              triggerContent={
                <span className='bg-blue-500 text-white rounded-full p-1'>
                  <GiNotebook size={20}/>
                </span>
              }
              onClick={()=> handleDeliver(row?.original)}
            />
          </>
        )}
        {/* {["PENDING"].includes(status) && (
          <GeneralTooltip
            content='Crear Despacho'
            triggerContent={
              <span className='bg-blue-500 text-white rounded-full p-1'>
                <GiNotebook size={20}/>
              </span>
            }
            onClick={()=> handleBuild(row?.original)}
          />
        )} */}
      </div>
    )
  },
}
]

export default columns