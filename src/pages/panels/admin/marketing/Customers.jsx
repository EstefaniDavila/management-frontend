import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TbPlus } from 'react-icons/tb'
import CustomersTable from '@/composables/admin/marketing/customers/tables/CustomersTable'
import CreateCustomerModal from '@/composables/admin/marketing/customers/modals/CreateCustomerModal'
import UpdateCustomerModal from '@/composables/admin/marketing/customers/modals/UpdateCustomerModal'
import ViewCustomerModal from '@/composables/admin/marketing/customers/modals/ViewCustomerModal'

const fakeCustomers = {
  rows: [
    { id: 1, code: 'CUST-001', business_name: 'Constructora Lima SAC', document_type: 'RUC', document_number: '20601234567', contact_name: 'María Torres',   phone: '987654321', email: 'contacto@constructora.com', type: 'construccion', address: 'Av. Industrial 123, Lima',        status: 'active', priority: 'CP', tracking: []   },
    { id: 2, code: 'CUST-002', business_name: 'Minera Andina',          document_type: 'RUC', document_number: '20555666777', contact_name: 'Carlos Rojas',   phone: '912345678', email: 'ventas@mineraandina.com',   type: 'mineria',     address: 'Carretera Central Km 45, Junín', status: 'active', priority: 'CR', tracking: []   },
    { id: 3, code: 'CUST-003', business_name: 'Transportes del Sur',    document_type: 'RUC', document_number: '20345678912', contact_name: 'Ana Flores',     phone: '998877665', email: 'info@transportesdelsur.com', type: 'transporte',  address: 'Panamericana Sur Km 120, Ica',   status: 'inactive', priority: 'CN', tracking: [] },
    { id: 4, code: 'CUST-004', business_name: 'Energía Perú SAC',       document_type: 'RUC', document_number: '20789123456', contact_name: 'Luis Fernández', phone: '965432187', email: 'lperu@energia.com',         type: 'energia',     address: 'Av. República 456, Lima',        status: 'active', priority: 'CP', tracking: []   },
  ],
}

const Customers = () => {
  const [customers, setCustomers]       = useState(fakeCustomers.rows)
  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch]             = useState('')
  const [searchFields, setSearchFields] = useState(['business_name'])
  const [selected, setSelected]         = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen]     = useState(false)

  const totalPages = Math.ceil(customers.length / pagination.pageSize)

  const handleCreate = (newC)     => setCustomers(prev => [newC, ...prev])
  const handleUpdate = (updated)  => setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c))
  const handleDelete = (customer) => setCustomers(prev => prev.filter(c => c.id !== customer.id))
  const handleView   = (customer) => { setSelected(customer); setIsViewOpen(true) }
  const handleEdit   = (customer) => { setSelected(customer); setIsUpdateOpen(true) }

  return (
    <>
      <div className="flex flex-col gap-4">

        {/* Título + botón */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Gestión de Clientes</h1>
            <p className="text-xs text-muted-foreground">Administra los clientes registrados en el sistema</p>
          </div>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <TbPlus size={16} className="mr-1" /> Nuevo Cliente
          </Button>
        </div>

        {/* Tabla */}
        <div className="border rounded-xl bg-card shadow-sm">
          <div className="px-4 pt-4 pb-2 border-b">
            <p className="text-sm font-medium">Clientes registrados</p>
          </div>
          <div className="p-4">
            <CustomersTable
              data={customers}
              fetchData={() => {}}
              pagination={pagination}
              setPagination={setPagination}
              totalPages={totalPages}
              search={search}
              setSearch={setSearch}
              searchFields={searchFields}
              setSearchFields={setSearchFields}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>

      </div>

      <CreateCustomerModal
        isOpen={isCreateOpen}
        handleClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />

      <UpdateCustomerModal
        isOpen={isUpdateOpen}
        handleClose={() => { setIsUpdateOpen(false); setSelected(null) }}
        customer={selected}
        onUpdate={handleUpdate}
      />

      <ViewCustomerModal
        isOpen={isViewOpen}
        handleClose={() => { setIsViewOpen(false); setSelected(null) }}
        customer={selected}
      />
    </>
  )
}

export default Customers