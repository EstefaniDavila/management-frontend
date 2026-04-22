import React from 'react'
import DataTable from '@/components/custom/data_table'

const columns = [
  { accessorKey: 'name', header: 'Cliente' },
  { accessorKey: 'document', header: 'Documento' },
]

const AdvisorClientsTable = (props) => {
  return <DataTable {...props} columns={columns} />
}

export default AdvisorClientsTable