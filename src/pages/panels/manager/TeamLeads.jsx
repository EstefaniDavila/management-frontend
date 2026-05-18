import React, { useState, useEffect } from 'react'
import TeamLeadsTable from '@/composables/manager/leads/tables/TeamLeadsTable'
import AssignLeadModal from '@/composables/manager/leads/modals/AssignLeadModal'
import ViewLeadModal from '@/composables/manager/leads/modals/ViewLeadModal'
import useCrud from '@/hooks/useCrud'
import useEntityMutation from '@/hooks/useEntityMutation'

const TeamLeads = () => {
  const { getModel } = useCrud('/api/v1/manager/leads')
  const leadMutation = useEntityMutation({ entityName: 'lead' })

  const [leads, setLeads] = useState([])
  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch]             = useState('')
  const [searchFields, setSearchFields] = useState(['name', 'email', 'company'])
  const [selected, setSelected]         = useState(null)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isViewOpen, setIsViewOpen]     = useState(false)
  const [totalPages, setTotalPages]     = useState(0)
  const [isLoading, setIsLoading]       = useState(true)

  const fetchLeads = async () => {
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
      const leadsArray = response.leads || []
      
      const formattedData = leadsArray.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        company: item.client_name || item.source || 'Sin empresa',
        request_type: item.type || 'machinery_sale',
        description: item.notes,
        status: item.status,
        priority: item.priority,
        assigned_to: (item.assigned_to_name && item.assigned_to_name !== 'Por Asignar') ? item.assigned_to_name : null,
        quotation_id: item.quotation_id,
        quotation_items: item.quotation_items || [],
        created_at: item.created_at,
        _original: item
      }))

      setLeads(formattedData)
      setTotalPages(response.total_pages || Math.ceil(formattedData.length / pagination.pageSize))
    } catch (error) {
      console.error("Error al cargar leads del equipo:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [pagination.pageIndex, pagination.pageSize, search])

  const refetchData = () => fetchLeads()

  const handleView   = (lead) => { setSelected(lead); setIsViewOpen(true)  }
  const handleAssign = (lead) => { setSelected(lead); setIsAssignOpen(true) }

  const handleSaveAssign = (leadId, advisorId) => {
    leadMutation.mutate({
      action: 'update',
      id: leadId,
      endpoint: `/api/v1/manager/leads/${leadId}/assign/${advisorId}`
    }, {
      onSuccess: () => {
        refetchData()
        setIsAssignOpen(false)
        setSelected(null)
      }
    })
  }

  return (
    <>
      <div className="flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Gestión de Leads</h1>
            <p className="text-xs text-muted-foreground">
              Asigna los leads entrantes a los asesores del equipo
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground border rounded-lg px-3 py-1.5">
            <span className="size-2 rounded-full bg-yellow-400 inline-block"/>
            {leads.filter(l => l.status === 'pending').length} sin asignar
          </div>
        </div>

        <div className="border rounded-xl bg-card shadow-sm">
          <div className="px-4 pt-4 pb-2 border-b">
            <p className="text-sm font-medium">Todos los leads</p>
          </div>
          <div className="p-4">
            <TeamLeadsTable
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
              onAssign={handleAssign}
            />
          </div>
        </div>

      </div>

      <ViewLeadModal
        isOpen={isViewOpen}
        handleClose={() => { setIsViewOpen(false); setSelected(null) }}
        lead={selected}
      />

      {/* Asegúrate de que AssignLeadModal reciba onAssign=(leadId, advisorId) => ... */}
      <AssignLeadModal
        isOpen={isAssignOpen}
        handleClose={() => { setIsAssignOpen(false); setSelected(null) }}
        lead={selected}
        onAssign={handleSaveAssign}
      />
    </>
  )
}

export default TeamLeads