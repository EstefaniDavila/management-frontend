import React, { createContext, useContext, useState } from 'react'

const AdvisorQuotationsContext = createContext()

const fakeAdvisorQuotations = [
  { id: 1, code: 'AQ-001', lead_id: 2, customer: 'Minera del Sur', email: 'mgonzalez@minera.com', equipment: 'Cargador Frontal Komatsu WA380', quotation_type: 'machinery_sale', advisor: 'Juan Pérez', amount: 260000, date: '2026-04-19', status: 'sent' },
  { id: 2, code: 'AQ-002', lead_id: 3, customer: 'Obras del Norte', email: 'lvargas@obras.com', equipment: 'Kit filtros Volvo', quotation_type: 'parts_sale', advisor: 'Carlos Ramírez', amount: 4500, date: '2026-04-20', status: 'approved' },
]

export const AdvisorQuotationsProvider = ({ children }) => {
  const [advisorQuotations, setAdvisorQuotations] = useState(fakeAdvisorQuotations)

  const createAdvisorQuotation = (q) =>
    setAdvisorQuotations(prev => [{ ...q, id: Date.now(), status: 'draft' }, ...prev])

  const sendQuotation = (id) =>
    setAdvisorQuotations(prev => prev.map(q => q.id === id ? { ...q, status: 'sent' } : q))

  const approveQuotation = (id) =>
    setAdvisorQuotations(prev => prev.map(q => q.id === id ? { ...q, status: 'approved' } : q))

  const rejectQuotation = (id) =>
    setAdvisorQuotations(prev => prev.map(q => q.id === id ? { ...q, status: 'rejected' } : q))

  const updateQuotation = (updated) =>
    setAdvisorQuotations(prev => prev.map(q => q.id === updated.id ? updated : q))

  return (
    <AdvisorQuotationsContext.Provider value={{ advisorQuotations, createAdvisorQuotation, sendQuotation, approveQuotation, rejectQuotation, updateQuotation }}>
      {children}
    </AdvisorQuotationsContext.Provider>
  )
}

export const useAdvisorQuotations = () => useContext(AdvisorQuotationsContext)