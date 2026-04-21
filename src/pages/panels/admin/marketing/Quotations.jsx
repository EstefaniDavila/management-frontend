import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TbPlus } from 'react-icons/tb'
import QuotationsTable from '@/composables/admin/marketing/quotations/tables/QuotationsTable'
import CreateQuotationModal from '@/composables/admin/marketing/quotations/modals/CreateQuotationModal'
import ViewQuotationModal from '@/composables/admin/marketing/quotations/modals/ViewQuotationModal'
import UpdateQuotationModal from '@/composables/admin/marketing/quotations/modals/UpdateQuotationModal'
import { useSales } from '@/providers/SalesContext'

const fakeQuotations = {
  rows: [
    { id: 1, code: 'QT-001', customer: 'Constructora Lima SAC', document: '20601234567', equipment: 'Excavadora CAT 320',             quotation_type: 'machinery_sale', advisor: 'Juan Pérez',     amount: 185000, date: '2026-04-15', status: 'Pending'  },
    { id: 2, code: 'QT-002', customer: 'Minera Andina',          document: '20555666777', equipment: 'Cargador Frontal Komatsu WA380', quotation_type: 'machinery_sale', advisor: 'Carlos Ramírez', amount: 260000, date: '2026-04-16', status: 'Approved' },
    { id: 3, code: 'QT-003', customer: 'Obras del Sur',          document: '20345678912', equipment: 'Retroexcavadora JCB 3CX',        quotation_type: 'parts_sale',     advisor: 'Luis Torres',    amount: 145000, date: '2026-04-17', status: 'Rejected' },
    { id: 4, code: 'QT-004', customer: 'Energía Perú SAC',       document: '20789123456', equipment: 'Mantenimiento preventivo',       quotation_type: 'maintenance',    advisor: 'Pedro Gómez',    amount: 8500,   date: '2026-04-19', status: 'Pending'  },
  ],
}

const Quotations = () => {
  const [quotations, setQuotations]     = useState(fakeQuotations.rows)
  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch]             = useState('')
  const [searchFields, setSearchFields] = useState(['code', 'customer'])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen]     = useState(false)
  const [selected, setSelected]         = useState(null)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const { createFromQuotation } = useSales()

  const totalPages = Math.ceil(quotations.length / pagination.pageSize)

  const handleCreate  = (newQ) => setQuotations(prev => [newQ, ...prev])
  const handleView    = (q)    => { setSelected(q); setIsViewOpen(true) }
//   const handleApprove = (q)    => setQuotations(prev => prev.map(item => item.id === q.id ? { ...item, status: 'Approved' } : item))
  const handleReject  = (q)    => setQuotations(prev => prev.map(item => item.id === q.id ? { ...item, status: 'Rejected' } : item))
  const handleDelete  = (id)   => setQuotations(prev => prev.filter(item => item.id !== id))

  const handleEdit   = (q) => { setSelected(q); setIsUpdateOpen(true) }
  const handleUpdate = (updated) => setQuotations(prev => prev.map(q => q.id === updated.id ? updated : q))
  const handleApprove = (q) => {
  setQuotations(prev => prev.map(item =>
    item.id === q.id ? { ...item, status: 'Approved' } : item
  ))
  createFromQuotation(q)  
}
  
  return (
    <>
      <div className="flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Cotizaciones</h1>
            <p className="text-xs text-muted-foreground">Gestiona las cotizaciones generadas para los clientes</p>
          </div>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <TbPlus size={16} className="mr-1" /> New Quotation
          </Button>
        </div>

        <div className="border rounded-xl bg-card shadow-sm">
          <div className="px-4 pt-4 pb-2 border-b">
            <p className="text-sm font-medium">Cotizaciones registradas</p>
          </div>
          <div className="p-4">
            <QuotationsTable
              data={quotations}
              fetchData={() => {}}
              pagination={pagination}
              setPagination={setPagination}
              totalPages={totalPages}
              search={search}
              setSearch={setSearch}
              searchFields={searchFields}
              setSearchFields={setSearchFields}
              onView={handleView}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              onEdit={handleEdit}   
            />
          </div>
        </div>

      </div>

      <CreateQuotationModal
        isOpen={isCreateOpen}
        handleClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />

      <ViewQuotationModal
        isOpen={isViewOpen}
        handleClose={() => { setIsViewOpen(false); setSelected(null) }}
        quotation={selected}
      />
      <UpdateQuotationModal
        isOpen={isUpdateOpen}
        handleClose={() => { setIsUpdateOpen(false); setSelected(null) }}
        quotation={selected}
        onUpdate={handleUpdate}
        />
    </>
  )
}

export default Quotations