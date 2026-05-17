import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LeadRequestsTable from '@/composables/advisor/leads/tables/LeadRequestsTable'
import ConvertToQuotationModal from '@/composables/advisor/leads/modals/ConvertToQuotationModal'
import ViewLeadModal from '@/composables/manager/leads/modals/ViewLeadModal'
import useCrud from '@/hooks/useCrud'
import useEntityMutation from '@/hooks/useEntityMutation'
import { useAuth } from '@/providers/UserContext'

const LeadRequests = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getModel } = useCrud('/api/v1/advisor/leads')
  const quotationMutation = useEntityMutation({ entityName: 'quotation' })
  const leadMutation = useEntityMutation({ entityName: 'lead' })

  const [leads, setLeads] = useState([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch] = useState('')
  const [searchFields, setSearchFields] = useState(['name', 'email', 'company'])
  const [selected, setSelected] = useState(null)
  const [isConvertOpen, setIsConvertOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedPriority, setSelectedPriority] = useState(null)

  const fetchLeads = async () => {
    try {
      setIsLoading(true)
      // Enviar advisor_id si es necesario, aunque en el back toma current_advisor_id = params[:advisor_id] || 1
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
      if (selectedPriority) {
        params.append('priority', selectedPriority)
      }

      const response = await getModel(`?${params.toString()}`)
      const leadsArray = response.leads || (Array.isArray(response) ? response : [])
      
      const formattedData = leadsArray.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        company: item.client_name ? `${item.client_name} (${item.client_code || '-'})` : item.source || 'Sin empresa',
        request_type: item.type || 'machinery_sale',
        description: item.notes,
        status: item.status,
        priority: item.priority,
        tracking: [],
        assigned_to: (item.assigned_to_name && item.assigned_to_name !== 'Por Asignar') ? item.assigned_to_name : null,
        quotation_id: item.quotation_id,
        quotation_items: item.quotation_items || [],
        created_at: item.created_at,
        _original: item
      }))

      setLeads(formattedData)
      setTotalPages(response.total_pages || Math.ceil(formattedData.length / pagination.pageSize))
    } catch (error) {
      console.error("Error al cargar leads:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [pagination.pageIndex, pagination.pageSize, search, selectedPriority])

  const refetchData = () => fetchLeads()

  const handleView    = (lead) => { setSelected(lead); setIsViewOpen(true) }
  const handleConvert = (lead) => {
    const cleanCompanyName = lead.company ? lead.company.split(' (')[0] : lead.name
    const queryParams = new URLSearchParams()
    queryParams.append('search', cleanCompanyName)
    if (lead.quotation_id) {
      queryParams.append('openQuotationId', lead.quotation_id)
    }
    navigate(`/advisor/quotations?${queryParams.toString()}`)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-base font-semibold">Mis Leads</h1>
          <p className="text-xs text-muted-foreground">Solicitudes asignadas a ti para gestionar</p>
        </div>

        {/* Filtros rápidos estilo Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-1">
          {[
            { id: null, label: 'Todos', desc: 'Ver todo', countColor: 'text-gray-500 bg-gray-100', border: 'border-gray-200' },
            { id: 'NC', label: 'NC', desc: 'Cliente Nuevo', countColor: 'text-purple-600 bg-purple-50', border: 'border-purple-200 hover:border-purple-400' },
            { id: 'CP', label: 'CP', desc: 'Cliente Potencial', countColor: 'text-yellow-600 bg-yellow-50', border: 'border-yellow-200 hover:border-yellow-400' },
            { id: 'NN', label: 'CN', desc: 'No Deseado', countColor: 'text-red-600 bg-red-50', border: 'border-red-200 hover:border-red-400' },
            { id: 'NH', label: 'CH', desc: 'Cliente Histórico', countColor: 'text-blue-600 bg-blue-50', border: 'border-blue-200 hover:border-blue-400' },
          ].map(card => {
            const isSelected = selectedPriority === card.id
            return (
              <button
                key={card.label}
                onClick={() => setSelectedPriority(card.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-300 ${card.border} ${
                  isSelected 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md font-semibold' 
                    : 'bg-card hover:bg-muted/50 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : card.countColor}`}>
                    {card.label}
                  </span>
                </div>
                <span className="text-xs font-bold truncate leading-none mt-1">{card.desc}</span>
                <span className={`text-[9px] mt-1.5 ${isSelected ? 'text-blue-100' : 'text-muted-foreground'}`}>
                  Filtrar bandeja
                </span>
              </button>
            )
          })}
        </div>

        <div className="border rounded-xl bg-card shadow-sm">
          <div className="px-4 pt-4 pb-2 border-b">
            <p className="text-sm font-medium">Leads asignados</p>
          </div>
          <div className="p-4">
            <LeadRequestsTable
              data={leads}
              fetchData={refetchData}
              pagination={pagination}
              setPagination={setPagination}
              totalPages={totalPages}
              search={search}
              setSearch={setSearch}
              searchFields={searchFields}
              setSearchFields={setSearchFields}
              onView={handleView}
              onConvert={handleConvert}
            />
          </div>
        </div>
      </div>

      <ViewLeadModal
        isOpen={isViewOpen}
        handleClose={() => { setIsViewOpen(false); setSelected(null) }}
        lead={selected}
      />
    </>
  )
}

export default LeadRequests