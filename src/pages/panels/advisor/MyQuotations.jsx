import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdvisorQuotationsTable from '@/composables/advisor/quotations/tables/AdvisorQuotationsTable'
import useCrud from '@/hooks/useCrud'
import useEntityMutation from '@/hooks/useEntityMutation'
import { useSales } from '@/providers/SalesContext'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/providers/UserContext'
import ViewQuotationModal from '@/composables/admin/marketing/quotations/modals/ViewQuotationModal'

const MyQuotations = () => {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { getModel } = useCrud('/api/v1/advisor/quotations')
  const quotationMutation = useEntityMutation({ entityName: 'quotation' })
  const { createFromQuotation } = useSales()

  const [quotations, setQuotations] = useState([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [searchFields, setSearchFields] = useState(['client_name'])
  const [selected, setSelected] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const openQuotationId = searchParams.get('openQuotationId')

  useEffect(() => {
    if (openQuotationId && quotations.length > 0) {
      const matched = quotations.find(q => q.id === openQuotationId)
      if (matched) {
        setSelected(matched)
      }
    }
  }, [openQuotationId, quotations])

  const fetchQuotations = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      params.append('page', pagination.pageIndex + 1)
      params.append('pageSize', pagination.pageSize)
      if (search) {
        params.append('search_params', search)
        params.append('search_fields', searchFields.join(','))
      }
      if (user?.roleable?.id) {
        params.append('advisor_id', user.roleable.id)
      }

      const response = await getModel(`?${params.toString()}`)
      const quotesArray = response.quotations || []
      
      const formattedData = quotesArray.map(item => ({
        id: item.id,
        code: item.code || '-',
        customer: item.client_name,
        equipment: (item.items && item.items.length > 0) ? item.items.map(i => i.description).join(', ') : 'Consultar items',
        quotation_type: item.quotation_type,
        advisor: user?.full_name || 'Asesor',
        subtotal: item.subtotal || 0,
        tax: item.tax || 0,
        amount: item.total || item.subtotal || 0,
        items: item.items || [],
        date: item.created_at,
        status: item.status,
        _original: item
      }))

      setQuotations(formattedData)
      setTotalPages(response.total_pages || Math.ceil(formattedData.length / pagination.pageSize))
    } catch (error) {
      console.error("Error al cargar cotizaciones:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotations()
  }, [pagination.pageIndex, pagination.pageSize, search])

  const handleView    = (q) => setSelected(q)
  
  const handleSend    = (id) => {
    quotationMutation.mutate({
      action: 'update',
      id,
      endpoint: `/api/v1/advisor/quotations/${id}/send_for_approval`
    }, {
      onSuccess: () => fetchQuotations()
    })
  }

  // En la nueva API, el asesor envía a revisión (send_for_approval),
  // y el cliente aprueba a través del manager o un portal.
  // Dejaremos los mock de approve/reject por si se usan para testing:
  const handleApprove = (q) => {
    quotationMutation.mutate({
      action: 'update',
      id: q.id,
      entity: { status: 'approved' }, // simulado si no hay endpoint específico en advisor
      endpoint: `/api/v1/advisor/quotations/${q.id}`
    }, {
      onSuccess: () => {
        fetchQuotations()
        if (q.quotation_type === 'machinery_sale' || q.quotation_type === 'parts_sale') {
          createFromQuotation({ ...q, code: q.code, equipment: q.equipment, document: '' })
        }
      }
    })
  }
  
  const handleReject = (id) => {
    quotationMutation.mutate({
      action: 'update',
      id,
      entity: { status: 'rejected' },
      endpoint: `/api/v1/advisor/quotations/${id}`
    }, {
      onSuccess: () => fetchQuotations()
    })
  }

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
            data={quotations}
            fetchData={fetchQuotations}
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

      <ViewQuotationModal
        isOpen={!!selected}
        handleClose={() => setSelected(null)}
        quotation={selected}
      />
    </div>
  )
}

export default MyQuotations