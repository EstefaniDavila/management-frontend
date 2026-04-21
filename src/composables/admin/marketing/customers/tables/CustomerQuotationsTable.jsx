import React, { useMemo } from 'react'
import DataTable from '@/components/custom/data_table'
import { Badge } from '@/components/ui/badge'

const statusColor = {
  Pending:  'bg-yellow-200 text-yellow-800',
  Approved: 'bg-green-200 text-green-800',
  Rejected: 'bg-red-200 text-red-800',
}

const typeLabels = {
  machinery_sale: 'Venta Maquinaria',
  parts_sale:     'Venta Repuestos',
  maintenance:    'Mantenimiento',
  rental:         'Alquiler',
}

const columns = [
  {
    accessorKey: 'code',
    header: 'Código',
    cell: info => <span className="font-mono text-xs">{info.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'quotation_type',
    header: 'Tipo',
    cell: info => typeLabels[info.getValue()] || info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'item_description',
    header: 'Ítem',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'advisor',
    header: 'Asesor',
    cell: info => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'amount',
    header: 'Monto (S/)',
    cell: info => `S/ ${info.getValue().toLocaleString()}`,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'date',
    header: 'Fecha',
    cell: info => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: info => {
      const value = info.getValue()
      return <Badge className={`px-2 py-1 ${statusColor[value]}`}>{value}</Badge>
    },
    enableColumnFilter: false,
  },
]

const CustomerQuotationsTable = ({
  data, fetchData, pagination, setPagination, totalPages,
  search, setSearch, searchFields, setSearchFields,
}) => {
  const cols = useMemo(() => columns, [])

  return (
    <DataTable
      columns={cols}
      data={data}
      fetchData={fetchData}
      pagination={pagination}
      setPagination={setPagination}
      totalPages={totalPages}
      search={search}
      setSearch={setSearch}
      searchFields={searchFields}
      setSearchFields={setSearchFields}
      searchableFields={["code", "item_description"]}
    />
  )
}

export default CustomerQuotationsTable