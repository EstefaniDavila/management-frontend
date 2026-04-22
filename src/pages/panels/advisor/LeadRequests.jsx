import React, { useState } from 'react'
import LeadRequestsTable from '@/composables/advisor/leads/tables/LeadRequestsTable'
import ConvertToQuotationModal from '@/composables/advisor/leads/modals/ConvertToQuotationModal'
import { useLeads } from '@/providers/advisor/LeadsContext'
import { useAdvisorQuotations } from '@/providers/advisor/AdvisorQuotationsContext'

// CAMBIA esto por el nombre del asesor logueado cuando tengas auth
const CURRENT_ADVISOR = 'Juan Pérez'

const LeadRequests = () => {
  const { leads, convertLead } = useLeads()
  const { createAdvisorQuotation } = useAdvisorQuotations()

  const myLeads = leads.filter(l => l.assigned_to === CURRENT_ADVISOR)

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch] = useState('')
  const [searchFields, setSearchFields] = useState(['company'])
  const [selected, setSelected] = useState(null)
  const [isConvertOpen, setIsConvertOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const totalPages = Math.ceil(myLeads.length / pagination.pageSize)

  const handleView    = (lead) => { setSelected(lead); setIsViewOpen(true) }
  const handleConvert = (lead) => { setSelected(lead); setIsConvertOpen(true) }

  const handleCreate = (quotation) => {
    createAdvisorQuotation(quotation)
    convertLead(selected.id)
    setIsConvertOpen(false)
    setSelected(null)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-base font-semibold">Mis Leads</h1>
          <p className="text-xs text-muted-foreground">Solicitudes asignadas a ti para gestionar</p>
        </div>

        <div className="border rounded-xl bg-card shadow-sm">
          <div className="px-4 pt-4 pb-2 border-b">
            <p className="text-sm font-medium">Leads asignados</p>
          </div>
          <div className="p-4">
            <LeadRequestsTable
              data={myLeads}
              fetchData={() => {}}
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

      <ConvertToQuotationModal
        isOpen={isConvertOpen}
        handleClose={() => { setIsConvertOpen(false); setSelected(null) }}
        lead={selected}
        onCreate={handleCreate}
      />
    </>
  )
}

export default LeadRequests