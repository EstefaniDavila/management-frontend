import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEdit } from "react-icons/tb";
import { TbTrash } from "react-icons/tb"
import { IoMdListBox } from "react-icons/io";


const typeColorVariants = {
  active: 'bg-green-200 text-green-800',
  inactive: 'bg-gray-200 text-gray-800',
  suspended: 'bg-yellow-200 text-yellow-800',
  blacklisted: 'bg-red-200 text-red-800',
  preferred: 'bg-blue-200 text-blue-800'
}

const columns = (handleDelete, handleUpdate, handleDescription) => [
  {
    accessorKey: 'id',
    header: 'Codigo',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'product_count',
    header: 'Total Productos',
    cell: info => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'phone',
    header: 'Telefono',
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
    cell: ({ row }) => (
      <div className="flex space-x-4">
        <GeneralTooltip 
          content="Editar Proveedor"
          triggerContent={
            <span className='bg-yellow-500 text-white rounded-full p-1'>
              <TbEdit size={20}/>
            </span>
          }
          onClick={() => handleUpdate(row?.original, "edit")}
        />
        <GeneralTooltip 
          content="Eliminar Proveedor"
          triggerContent={
            <span className='bg-red-500 text-white rounded-full p-1'>
              <TbTrash size={20}/>
            </span>
          }
          onClick={() => handleDelete(row?.original.id)}
        />
        <GeneralTooltip 
          content="Descripcion del Proveedor"
          triggerContent={
            <span className='bg-green-500 text-white rounded-full p-1'>
              <IoMdListBox size={20}/>
            </span>
          }
          onClick={() => handleDescription(row?.original, "description")}
        />
      </div>
    ),
  }
]

export default columns
