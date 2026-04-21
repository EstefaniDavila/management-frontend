import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TbPlus } from 'react-icons/tb'
import SalesOrdersTable from '@/composables/admin/marketing/salesOrders/tables/SalesOrdersTable'
import CreateSalesOrderModal from '@/composables/admin/marketing/salesOrders/modals/CreateSalesOrderModal'
import ViewSalesOrderModal from '@/composables/admin/marketing/salesOrders/modals/ViewSalesOrderModal'
import { useSales } from '@/providers/SalesContext'

const SalesOrders = () => {
  const { salesOrders, updateOrder, deleteOrder, createOrder } = useSales()

  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch]             = useState('')
  const [searchFields, setSearchFields] = useState(['code'])
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [isViewOpen, setIsViewOpen]     = useState(false)
  const [selected, setSelected]         = useState(null)

  const totalPages = Math.ceil(salesOrders.length / pagination.pageSize)

  const handleCreate = ()    => { setSelected(null); setIsModalOpen(true) }
  const handleEdit   = (row) => { setSelected(row);  setIsModalOpen(true) }
  const handleView   = (row) => { setSelected(row);  setIsViewOpen(true) }
  const handleDelete = (row) => deleteOrder(row.id)

  const handleSave = (form) => {
    if (form.id) updateOrder(form)
    else         createOrder({ ...form, id: Date.now(), status: 'Generated' })
  }

  return (
    <>
      <div className="flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Órdenes de Venta</h1>
            <p className="text-xs text-muted-foreground">Gestiona las órdenes generadas a partir de cotizaciones aprobadas</p>
          </div>
          <Button size="sm" onClick={handleCreate}>
            <TbPlus className="mr-1" size={16}/> Nueva Orden
          </Button>
        </div>

        <div className="border rounded-xl bg-card shadow-sm">
          <div className="px-4 pt-4 pb-2 border-b">
            <p className="text-sm font-medium">Órdenes registradas</p>
          </div>
          <div className="p-4">
            <SalesOrdersTable
              data={salesOrders}
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

      <CreateSalesOrderModal
        isOpen={isModalOpen}
        handleClose={() => { setIsModalOpen(false); setSelected(null) }}
        onSave={handleSave}
        initialData={selected}
      />

      <ViewSalesOrderModal
        isOpen={isViewOpen}
        handleClose={() => { setIsViewOpen(false); setSelected(null) }}
        order={selected}
      />
    </>
  )
}

export default SalesOrders