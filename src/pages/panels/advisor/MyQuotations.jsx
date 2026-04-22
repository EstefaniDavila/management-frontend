import React, { useState } from 'react'
import AdvisorQuotationsTable from '@/composables/advisor/quotations/tables/AdvisorQuotationsTable'
import { useAdvisorQuotations } from '@/providers/advisor/AdvisorQuotationsContext'
import { useSales } from '@/providers/SalesContext'
import { Badge } from '@/components/ui/badge'

const CURRENT_ADVISOR = 'Juan Pérez'

const MyQuotations = () => {
  const { advisorQuotations, sendQuotation, approveQuotation, rejectQuotation } = useAdvisorQuotations()
  const { createFromQuotation } = useSales()

  const myQuotations = advisorQuotations.filter(q => q.advisor === CURRENT_ADVISOR)

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch] = useState('')
  const [searchFields, setSearchFields] = useState(['code', 'customer'])
  const [selected, setSelected] = useState(null)

  const totalPages = Math.ceil(myQuotations.length / pagination.pageSize)

  const handleView    = (q) => setSelected(q)
  const handleSend    = (id) => sendQuotation(id)
  const handleApprove = (q) => {
    approveQuotation(q.id)
    // Si es venta, crea Sales Order automáticamente
    if (q.quotation_type === 'machinery_sale' || q.quotation_type === 'parts_sale') {
      createFromQuotation({ ...q, code: q.code, equipment: q.equipment, document: '' })
    }
  }
  const handleReject = (id) => rejectQuotation(id)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-base font-semibold">Mis Cotizaciones</h1>
        <p className="text-xs text-muted-foreground">Cotizaciones que has creado — enviadas y pendientes de respuesta</p>
      </div>

      <div className="border rounded-xl bg-card shadow-sm">
        <div className="px-4 pt-4 pb-2 border-b">
          <p className="text-sm font-medium">Cotizaciones registradas</p>
        </div>
        <div className="p-4">
          <AdvisorQuotationsTable
            data={myQuotations}
            fetchData={() => {}}
            pagination={pagination}
            setPagination={setPagination}
            totalPages={totalPages}
            search={search}
            setSearch={setSearch}
            searchFields={searchFields}
            setSearchFields={setSearchFields}
            onView={handleView}
            onSend={handleSend}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  )
}

export default MyQuotations