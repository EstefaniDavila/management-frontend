import React from 'react'
import { Badge } from '@/components/ui/badge'
import GeneralTooltip from '@/helpers/generalTooltip'
import { TbEdit, TbTrash, TbEye, TbCheck, TbX } from "react-icons/tb"

const statusColorVariants = {
  Pending:  'bg-yellow-200 text-yellow-800',
  Approved: 'bg-green-200 text-green-800',
  Rejected: 'bg-red-200 text-red-800',
}

const columns = (handleView, handleApprove, handleReject, handleDelete) => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: info => <span className="font-mono text-xs">{info.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'equipment',
    header: 'Equipment',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'advisor',
    header: 'Advisor',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'amount',
    header: 'Amount (S/)',
    cell: info => `S/ ${info.getValue().toLocaleString()}`,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: info => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: info => {
      const value = info.getValue()
      const color = statusColorVariants[value] || 'bg-gray-200 text-gray-800'
      return <Badge className={`px-2 py-1 rounded ${color}`}>{value}</Badge>
    },
    enableColumnFilter: true,
  },
  {
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <GeneralTooltip
          content="View Detail"
          triggerContent={<span className='bg-blue-500 text-white rounded-full p-1'><TbEye size={18}/></span>}
          onClick={() => handleView(row.original)}
        />
        <GeneralTooltip
          content="Approve"
          triggerContent={<span className='bg-green-500 text-white rounded-full p-1'><TbCheck size={18}/></span>}
          onClick={() => handleApprove(row.original)}
        />
        <GeneralTooltip
          content="Reject"
          triggerContent={<span className='bg-yellow-500 text-white rounded-full p-1'><TbX size={18}/></span>}
          onClick={() => handleReject(row.original)}
        />
        <GeneralTooltip
          content="Delete"
          triggerContent={<span className='bg-red-500 text-white rounded-full p-1'><TbTrash size={18}/></span>}
          onClick={() => handleDelete(row.original.id)}
        />
      </div>
    ),
  }
]

export default columns