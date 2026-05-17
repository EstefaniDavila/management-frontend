import React from 'react'
import GeneralTooltip from '@/helpers/generalTooltip'
import { Eye } from 'lucide-react';
import { TbEdit } from 'react-icons/tb'
import { TbTrash } from 'react-icons/tb'

const columns = (handleShow, handleDelete) => [
  // {
  //   accessorKey: 'code',
  //   header: 'Código',
  //   cell: info => info.getValue(),
  //   enableColumnFilter: true,
  // },
  {
    accessorKey: 'action',
    header: 'Acción',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
  header: 'Acciones',
  cell: ({ row }) => {
    const status = row?.original?.status

    return (
      <div className='flex space-x-4'>
        <GeneralTooltip
          content='Revisar Mantenimiento'
          triggerContent={
            <span className='bg-green-500 text-white rounded-full p-1'>
              <Eye size={20}/>
            </span>
          }
          onClick={()=> handleShow(row?.original, 'show')}
        />
        {/* <GeneralTooltip
          content='Revisar Mantenimiento'
          triggerContent={
            <span className='bg-yellow-500 text-white rounded-full p-1'>
              <Eye size={20}/>
            </span>
          }
          onClick={()=> handleShow(row?.original, 'edit')}
        /> */}
        <GeneralTooltip
          content='Eliminar Mantenimiento'
          triggerContent={
            <span className='bg-red-500 text-white rounded-full p-1'>
              <TbTrash size={20}/>
            </span>
          }
          onClick={()=> handleDelete(row?.original?.id, 'delete')}
        />
      </div>
    )
  },
}
]

export default columns