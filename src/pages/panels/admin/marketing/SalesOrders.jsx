import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TbPlus } from 'react-icons/tb'
import SalesOrdersTable from '@/composables/admin/marketing/salesOrders/tables/SalesOrdersTable'
import CreateSalesOrderModal from '@/composables/admin/marketing/salesOrders/modals/CreateSalesOrderModal'
import ViewSalesOrderModal from '@/composables/admin/marketing/salesOrders/modals/ViewSalesOrderModal'
import useCrud from '@/hooks/useCrud'
import { useEffect } from 'react'

const SalesOrders = () => {
  const { getModel, deleteModel } = useCrud('/api/v1/admin/sales_orders')
  const [salesOrders, setSalesOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await getModel()
      // Map backend data to frontend table structure
      const mapped = (res.sales_orders || []).map(o => ({
        id: o.id,
        code: o.code,
        quotation_code: o.quotation?.code || '-',
        customer: o.client?.business_name || o.client?.contact_name || 'Sin cliente',
        document: o.client?.document_number || '-',
        order_type: o.quotation?.quotation_type || 'sale',
        advisor: o.advisor ? `${o.advisor.first_name} ${o.advisor.last_name}` : 'Sin asesor',
        amount: o.total,
        date: new Date(o.created_at).toISOString().split('T')[0],
        status: o.status,
        _original: o
      }))
      setSalesOrders(mapped)
    } catch (e) {
      console.error(e)
    }
  }

  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch]             = useState('')
  const [searchFields, setSearchFields] = useState(['code', 'customer'])
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [isViewOpen, setIsViewOpen]     = useState(false)
  const [selected, setSelected]         = useState(null)

  const totalPages = Math.ceil(salesOrders.length / pagination.pageSize)

  const handleCreate = ()    => { setSelected(null); setIsModalOpen(true) }
  const handleEdit   = (row) => { setSelected(row);  setIsModalOpen(true) }
  const handleView   = (row) => { setSelected(row);  setIsViewOpen(true) }
  const handleDelete = async (row) => {
    if (window.confirm('¿Seguro que deseas eliminar esta orden?')) {
      await deleteModel(row.id)
      fetchOrders()
    }
  }

  const handleSave = (form) => {
    // Para simplificar, recargamos la data tras crear/editar
    fetchOrders()
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