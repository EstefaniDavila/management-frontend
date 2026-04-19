import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import QuotationsTable from '@/composables/admin/marketing/quotations/tables/QuotationsTable'
import CreateQuotationModal from '@/composables/admin/marketing/quotations/modals/CreateQuotationModal'
import ViewQuotationModal from '@/composables/admin/marketing/quotations/modals/ViewQuotationModal'
import { Button } from '@/components/ui/button'
import { TbPlus } from 'react-icons/tb'

const fakeQuotations = {
  rows: [
    { id: 1, code: 'QT-001', customer: 'Constructora Lima SAC', document: '20601234567', equipment: 'Excavadora CAT 320',          advisor: 'Juan Pérez',    amount: 185000, date: '2026-04-15', status: 'Pending'  },
    { id: 2, code: 'QT-002', customer: 'Minera Andina',          document: '20555666777', equipment: 'Cargador Frontal Komatsu WA380', advisor: 'Carlos Ramírez', amount: 260000, date: '2026-04-16', status: 'Approved' },
    { id: 3, code: 'QT-003', customer: 'Obras del Sur',          document: '20345678912', equipment: 'Retroexcavadora JCB 3CX',       advisor: 'Luis Torres',   amount: 145000, date: '2026-04-17', status: 'Rejected' },
  ],
  rowCount: 3
}

const Quotations = () => {
  const [quotations, setQuotations]   = useState(fakeQuotations.rows)
  const [pagination, setPagination]   = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch]           = useState('')
  const [searchFields, setSearchFields] = useState(['code', 'customer'])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen]     = useState(false)
  const [selected, setSelected]         = useState(null)

  const totalPages = Math.ceil(quotations.length / pagination.pageSize)

  const handleCreate = (newQ) => setQuotations(prev => [newQ, ...prev])

  const handleView = (q) => { setSelected(q); setIsViewOpen(true) }

  const handleApprove = (q) =>
    setQuotations(prev => prev.map(item => item.id === q.id ? { ...item, status: 'Approved' } : item))

  const handleReject = (q) =>
    setQuotations(prev => prev.map(item => item.id === q.id ? { ...item, status: 'Rejected' } : item))

  const handleDelete = (id) =>
    setQuotations(prev => prev.filter(item => item.id !== id))

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <h1 className="text-base font-semibold tracking-tight text-foreground">
          Cotizaciones
        </h1>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales Management — Quotations</CardTitle>
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              <TbPlus size={16} className="mr-1" /> New Quotation
            </Button>
          </CardHeader>
          <CardContent>
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
            />
          </CardContent>
        </Card>
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
    </>
  )
}

export default Quotations