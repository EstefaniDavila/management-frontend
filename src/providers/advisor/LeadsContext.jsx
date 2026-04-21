import React, { createContext, useContext, useState } from 'react'

const LeadsContext = createContext()

const fakeLeads = [
  { id: 1, name: 'Carlos Pérez', email: 'cperez@constructora.com', phone: '987654321', company: 'Constructora ABC', request_type: 'machinery_sale', description: 'Necesito cotización para excavadora CAT 320', status: 'pending', assigned_to: null, created_at: '2026-04-18' },
  { id: 2, name: 'María González', email: 'mgonzalez@minera.com', phone: '912345678', company: 'Minera del Sur', request_type: 'maintenance', description: 'Mantenimiento preventivo para cargador frontal', status: 'assigned', assigned_to: 'Juan Pérez', created_at: '2026-04-19' },
  { id: 3, name: 'Luis Vargas', email: 'lvargas@obras.com', phone: '998877665', company: 'Obras del Norte', request_type: 'parts_sale', description: 'Kit de filtros para volquete Volvo', status: 'converted', assigned_to: 'Carlos Ramírez', created_at: '2026-04-20' },
]

export const LeadsProvider = ({ children }) => {
  const [leads, setLeads] = useState(fakeLeads)

  const createLead = (lead) =>
    setLeads(prev => [{ ...lead, id: Date.now(), status: 'pending', assigned_to: null, created_at: new Date().toISOString().split('T')[0] }, ...prev])

  const assignLead = (leadId, advisorName) =>
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'assigned', assigned_to: advisorName } : l))

  const convertLead = (leadId) =>
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'converted' } : l))

  const deleteLead = (id) =>
    setLeads(prev => prev.filter(l => l.id !== id))

  return (
    <LeadsContext.Provider value={{ leads, createLead, assignLead, convertLead, deleteLead }}>
      {children}
    </LeadsContext.Provider>
  )
}

export const useLeads = () => useContext(LeadsContext)