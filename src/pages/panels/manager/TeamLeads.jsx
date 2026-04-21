import React, { useState } from 'react'
import { useLeads } from '@/providers/advisor/LeadsContext'
import TeamLeadsTable from '@/composables/manager/leads/tables/TeamLeadsTable'
import AssignLeadModal from '@/composables/manager/leads/modals/AssignLeadModal'
import ViewLeadModal from '@/composables/manager/leads/modals/ViewLeadModal'

const TeamLeads = () => {
  const { leads, assignLead } = useLeads()

  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch]             = useState('')
  const [searchFields, setSearchFields] = useState(['company'])
  const [selected, setSelected]         = useState(null)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isViewOpen, setIsViewOpen]     = useState(false)

  const totalPages = Math.ceil(leads.length / pagination.pageSize)

  const handleView   = (lead) => { setSelected(lead); setIsViewOpen(true)  }
  const handleAssign = (lead) => { setSelected(lead); setIsAssignOpen(true) }

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
              fetchData={() => {}}
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

      <AssignLeadModal
        isOpen={isAssignOpen}
        handleClose={() => { setIsAssignOpen(false); setSelected(null) }}
        lead={selected}
        onAssign={assignLead}
      />
    </>
  )
}

export default TeamLeads