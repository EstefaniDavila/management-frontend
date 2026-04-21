import React from 'react'
import { useLeads } from '@/providers/advisor/LeadsContext'
import { useAdvisorQuotations } from '@/providers/advisor/AdvisorQuotationsContext'

const CURRENT_ADVISOR = 'Juan Pérez'

const MyClients = () => {
  const { leads } = useLeads()
  const { advisorQuotations } = useAdvisorQuotations()

  // Clientes = leads convertidos asignados a este asesor
  const myClients = leads.filter(l => l.assigned_to === CURRENT_ADVISOR && l.status === 'converted')

  const getQuotationsForLead = (leadId) =>
    advisorQuotations.filter(q => q.lead_id === leadId)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-base font-semibold">Mis Clientes</h1>
        <p className="text-xs text-muted-foreground">Clientes que ya tienen cotizaciones creadas</p>
      </div>

      <div className="flex flex-col gap-3">
        {myClients.length === 0 && (
          <div className="border rounded-xl bg-card p-8 text-center text-sm text-muted-foreground">
            Aún no tienes clientes con cotizaciones generadas.
          </div>
        )}
        {myClients.map(client => {
          const quotations = getQuotationsForLead(client.id)
          return (
            <div key={client.id} className="border rounded-xl bg-card shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{client.company}</p>
                  <p className="text-xs text-muted-foreground">{client.name} · {client.email}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {quotations.length} cotización{quotations.length !== 1 ? 'es' : ''}
                </span>
              </div>
              {quotations.length > 0 && (
                <div className="flex flex-col gap-1">
                  {quotations.map(q => (
                    <div key={q.id} className="flex items-center justify-between text-xs border rounded-lg px-3 py-2">
                      <span className="font-mono">{q.code}</span>
                      <span className="text-muted-foreground">{q.equipment}</span>
                      <span>S/ {q.amount.toLocaleString()}</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        q.status === 'approved' ? 'bg-green-100 text-green-800' :
                        q.status === 'sent'     ? 'bg-blue-100 text-blue-800' :
                        q.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                  'bg-gray-100 text-gray-700'
                      }`}>{q.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyClients