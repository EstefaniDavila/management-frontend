import React, { useState } from 'react'
import CustomerHistoryTable from '@/composables/admin/marketing/customerHistory/tables/CustomerHistoryTable'
import CustomerDetailModal from '@/composables/admin/marketing/customerHistory/modals/CustomerDetailModal'

const fakeCustomers = [
  { id: 1, code: 'CUST-001', business_name: 'Constructora Lima SAC', document_type: 'RUC', document_number: '20601234567', contact_name: 'María Torres',   phone: '987654321', email: 'contacto@constructora.com', type: 'construccion', address: 'Av. Industrial 123, Lima',        status: 'active'   },
  { id: 2, code: 'CUST-002', business_name: 'Minera Andina',          document_type: 'RUC', document_number: '20555666777', contact_name: 'Carlos Rojas',   phone: '912345678', email: 'ventas@mineraandina.com',   type: 'mineria',     address: 'Carretera Central Km 45, Junín', status: 'active'   },
  { id: 3, code: 'CUST-003', business_name: 'Transportes del Sur',    document_type: 'RUC', document_number: '20345678912', contact_name: 'Ana Flores',     phone: '998877665', email: 'info@transportesdelsur.com', type: 'transporte',  address: 'Panamericana Sur Km 120, Ica',   status: 'inactive' },
  { id: 4, code: 'CUST-004', business_name: 'Energía Perú SAC',       document_type: 'RUC', document_number: '20789123456', contact_name: 'Luis Fernández', phone: '965432187', email: 'lperu@energia.com',         type: 'energia',     address: 'Av. República 456, Lima',        status: 'active'   },
]

const CustomerHistory = () => {
  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch]             = useState('')
  const [searchFields, setSearchFields] = useState(['business_name'])
  const [selected, setSelected]         = useState(null)
  const [isModalOpen, setIsModalOpen]   = useState(false)

  const totalPages = Math.ceil(fakeCustomers.length / pagination.pageSize)

  const handleView = (customer) => {
    setSelected(customer)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="flex flex-col gap-4">

        {/* Título */}
        <div>
          <h1 className="text-base font-semibold">Historial de Clientes</h1>
          <p className="text-xs text-muted-foreground">
            Consulta el historial de cotizaciones por cliente
          </p>
        </div>

        {/* Tabla */}
        <div className="border rounded-xl bg-card shadow-sm">
          <div className="px-4 pt-4 pb-2 border-b">
            <p className="text-sm font-medium">Clientes registrados</p>
          </div>
          <div className="p-4">
            <CustomerHistoryTable
              data={fakeCustomers}
              fetchData={() => {}}
              pagination={pagination}
              setPagination={setPagination}
              totalPages={totalPages}
              search={search}
              setSearch={setSearch}
              searchFields={searchFields}
              setSearchFields={setSearchFields}
              onView={handleView}
            />
          </div>
        </div>

      </div>

      <CustomerDetailModal
        isOpen={isModalOpen}
        handleClose={() => { setIsModalOpen(false); setSelected(null) }}
        customer={selected}
      />
    </>
  )
}

export default CustomerHistory