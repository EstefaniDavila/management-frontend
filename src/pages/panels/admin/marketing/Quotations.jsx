import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { TbPlus } from 'react-icons/tb'
import QuotationsTable from '@/composables/admin/marketing/quotations/tables/QuotationsTable'
import CreateQuotationModal from '@/composables/admin/marketing/quotations/modals/CreateQuotationModal'
import ViewQuotationModal from '@/composables/admin/marketing/quotations/modals/ViewQuotationModal'
import UpdateQuotationModal from '@/composables/admin/marketing/quotations/modals/UpdateQuotationModal'
import useCrud from '@/hooks/useCrud'
import useEntityMutation from '@/hooks/useEntityMutation'
import { useSales } from '@/providers/SalesContext'
import RenderProfiler from '@/components/RenderProfiler'

const Quotations = () => {
  const { getModel } = useCrud('/api/v1/admin/quotations')
  const quotationMutation = useEntityMutation({ entityName: 'quotation' })

  const [quotations, setQuotations]     = useState([])
  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch]             = useState('')
  const [searchFields, setSearchFields] = useState(['client_name'])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen]     = useState(false)
  const [selected, setSelected]         = useState(null)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [totalPages, setTotalPages]     = useState(0)
  const [isLoading, setIsLoading]       = useState(true)
  const { createFromQuotation } = useSales()

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

      const response = await getModel(`?${params.toString()}`)
      const quotesArray = response.quotations || response.data || []
      
      const formattedData = quotesArray.map(item => ({
        id: item.id,
        code: item.code || '-',
        customer: item.client_name || item.customer,
        document: item.client_document || '-',
        equipment: 'Consultar items', 
        quotation_type: item.quotation_type || 'machinery_sale',
        advisor: item.advisor_name || item.advisor || 'Sin asignar',
        amount: item.total || item.subtotal || 0,
        subtotal: item.subtotal || 0,
        tax: item.tax || 0,
        items: item.items || [],
        lead_description: item.lead_description || '',
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

  const refetchData = () => fetchQuotations()

  const handleCreate = (newQ) => {
    quotationMutation.mutate({
      action: 'create',
      entity: newQ,
      endpoint: '/api/v1/admin/quotations'
    }, {
      onSuccess: () => {
        refetchData()
        setIsCreateOpen(false)
      }
    })
  }

  const handleUpdate = (updated) => {
    quotationMutation.mutate({
      action: 'update',
      id: updated.id,
      entity: updated,
      endpoint: `/api/v1/admin/quotations/${updated.id}`
    }, {
      onSuccess: () => {
        refetchData()
        setIsUpdateOpen(false)
        setSelected(null)
      }
    })
  }

  const handleDelete = (id) => {
    quotationMutation.mutate({
      action: 'delete',
      id,
      endpoint: `/api/v1/admin/quotations/${id}`
    }, {
      onSuccess: () => refetchData()
    })
  }

  const handleView = (q) => { setSelected(q); setIsViewOpen(true) }
  const handleEdit = (q) => { setSelected(q); setIsUpdateOpen(true) }

  // Simulando aprobar y rechazar como una actualización de estado
  const handleApprove = (q) => {
    quotationMutation.mutate({
      action: 'update',
      id: q.id,
      entity: { status: 'Approved' },
      endpoint: `/api/v1/admin/quotations/${q.id}`
    }, {
      onSuccess: () => {
        refetchData()
        createFromQuotation(q)
      }
    })
  }

  const handleReject = (q) => {
    quotationMutation.mutate({
      action: 'update',
      id: q.id,
      entity: { status: 'Rejected' },
      endpoint: `/api/v1/admin/quotations/${q.id}`
    }, {
      onSuccess: () => refetchData()
    })
  }

  return (
    <>
      <RenderProfiler id="Admin-Quotations-Dashboard">
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
              <RenderProfiler id="Admin-Quotations-TanStack-Table">
                <QuotationsTable
                  data={quotations}
                  fetchData={refetchData}
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
              </RenderProfiler>
            </div>
          </div>

        </div>
      </RenderProfiler>

      <RenderProfiler id="Admin-CreateQuotation-Modal">
        <CreateQuotationModal
          isOpen={isCreateOpen}
          handleClose={() => setIsCreateOpen(false)}
          onCreate={handleCreate}
        />
      </RenderProfiler>

      <RenderProfiler id="Admin-ViewQuotation-Modal">
        <ViewQuotationModal
          isOpen={isViewOpen}
          handleClose={() => { setIsViewOpen(false); setSelected(null) }}
          quotation={selected}
        />
      </RenderProfiler>
      <RenderProfiler id="Admin-UpdateQuotation-Modal">
        <UpdateQuotationModal
          isOpen={isUpdateOpen}
          handleClose={() => { setIsUpdateOpen(false); setSelected(null) }}
          quotation={selected}
          onUpdate={handleUpdate}
        />
      </RenderProfiler>
    </>
  )
}

export default Quotations