import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

export default function EquipmentRentalTable({ 
  data, 
  fetchData, 
  pagination, 
  setPagination, 
  search, 
  setSearch, 
  totalPages,
  onOpenReport
}) {
  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>
    },
    {
      accessorKey: 'customer',
      header: 'Cliente',
      cell: ({ row }) => <span className="font-medium">{row.original.customer}</span>
    },
    {
      accessorKey: 'equipment',
      header: 'Equipo Rentado',
      cell: ({ row }) => <span>{row.original.equipment}</span>
    },
    {
      accessorKey: 'deliveryDate',
      header: 'Fecha Entrega',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.deliveryDate}</span>
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.original.status
        let badgeColor = 'bg-gray-100 text-gray-800'
        if (status === 'Activa') badgeColor = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        if (status === 'Entregada') badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        if (status === 'Pendiente') badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'

        return <Badge className={`${badgeColor} border-transparent`} variant="outline">{status}</Badge>
      }
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 gap-2"
          onClick={() => onOpenReport(row.original)}
        >
          <FileText className="h-4 w-4 text-blue-600" />
          <span className="hidden sm:inline">Ver Informe</span>
        </Button>
      )
    }
  ], [onOpenReport])

  return (
    <DataTable
      columns={columns}
      data={data}
      fetchData={fetchData}
      pagination={pagination}
      setPagination={setPagination}
      search={search}
      setSearch={setSearch}
      searchFields={['customer', 'equipment']}
      setSearchFields={() => {}}
      searchableFields={['customer', 'equipment']}
      totalPages={totalPages}
    />
  )
}
