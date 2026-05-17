import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdvisorQuotationsTable from '@/composables/advisor/quotations/tables/AdvisorQuotationsTable'
import useCrud from '@/hooks/useCrud'
import useEntityMutation from '@/hooks/useEntityMutation'
import { useSales } from '@/providers/SalesContext'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/providers/UserContext'
import ViewQuotationModal from '@/composables/admin/marketing/quotations/modals/ViewQuotationModal'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/custom/button"

const MyQuotations = () => {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { getModel } = useCrud('/api/v1/advisor/quotations')
  const { insertModel: insertAreaRequest } = useCrud('/api/v1/advisor/area_requests')
  const quotationMutation = useEntityMutation({ entityName: 'quotation' })
  const { createFromQuotation } = useSales()

  const [quotations, setQuotations] = useState([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [searchFields, setSearchFields] = useState(['client_name'])
  const [selected, setSelected] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Send to Area modal states
  const [isSendToAreaOpen, setIsSendToAreaOpen] = useState(false)
  const [selectedQuotationForArea, setSelectedQuotationForArea] = useState(null)
  const [areaRequestFormData, setAreaRequestFormData] = useState({
    area: 'Logística',
    name: 'Completar Cotización',
    description: ''
  })

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
        has_completed_area_request: item.has_completed_area_request,
        pending_area_request: item.pending_area_request,
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

  const handleOpenSendToArea = (q) => {
    setSelectedQuotationForArea(q)
    setAreaRequestFormData({
      area: q.quotation_type === 'rental' ? 'Logística' : 'Operaciones',
      name: 'Completar Cotización',
      description: `Por favor, revisar disponibilidad de la máquina para la cotización de ${q.quotation_type === 'rental' ? 'Alquiler' : 'Mantenimiento'}, revisar estado técnico y definir precio unitario sugerido.`
    })
    setIsSendToAreaOpen(true)
  }

  const handleSendToAreaSubmit = async () => {
    if (!selectedQuotationForArea) return
    try {
      await insertAreaRequest({
        user_id: user?.id,
        advisor_id: user?.roleable_type !== 'Manager' ? user?.roleable?.id : null,
        area_request: {
          quotation_id: selectedQuotationForArea.id,
          area: areaRequestFormData.area,
          name: areaRequestFormData.name,
          description: areaRequestFormData.description
        }
      })
      setIsSendToAreaOpen(false)
      setSelectedQuotationForArea(null)
      fetchQuotations()
    } catch (e) {
      console.error(e)
    }
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
            onSendToArea={handleOpenSendToArea}
          />
        </div>
      </div>

      <ViewQuotationModal
        isOpen={!!selected}
        handleClose={() => setSelected(null)}
        quotation={selected}
      />

      <Dialog open={isSendToAreaOpen} onOpenChange={setIsSendToAreaOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">Enviar a Área Especializada</DialogTitle>
            <DialogDescription>
              Solicita al equipo de Logística u Operaciones que complete los datos de esta cotización de alquiler o mantenimiento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-black dark:text-white">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="toArea" className="text-right text-xs">
                Área Destino
              </Label>
              <Select value={areaRequestFormData.area} onValueChange={(v) => setAreaRequestFormData({...areaRequestFormData, area: v})}>
                <SelectTrigger className="col-span-3 text-black dark:text-white">
                  <SelectValue placeholder="Selecciona el área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Logística">Logística (Sugerido para Alquileres)</SelectItem>
                  <SelectItem value="Operaciones">Operaciones (Sugerido para Mantenimiento)</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Técnico">Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reqType" className="text-right text-xs">
                Tipo
              </Label>
              <Select value={areaRequestFormData.name} onValueChange={(v) => setAreaRequestFormData({...areaRequestFormData, name: v})}>
                <SelectTrigger className="col-span-3 text-black dark:text-white">
                  <SelectValue placeholder="Tipo de solicitud" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completar Cotización">Completar Cotización</SelectItem>
                  <SelectItem value="Revisión Técnica">Revisión Técnica</SelectItem>
                  <SelectItem value="Actualización Datos">Actualización Datos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="reqDescription" className="text-right pt-2 text-xs">
                Detalle / Notas
              </Label>
              <Textarea
                id="reqDescription"
                value={areaRequestFormData.description}
                onChange={(e) => setAreaRequestFormData({...areaRequestFormData, description: e.target.value})}
                placeholder="Indica qué campos o datos específicos requieres que completen..."
                className="col-span-3 text-black dark:text-white bg-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSendToAreaSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Enviar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MyQuotations