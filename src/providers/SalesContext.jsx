import React, { createContext, useContext, useState } from 'react'

const SalesContext = createContext()

const fakeSalesOrders = [
  {
    id: 1, code: 'SO-001', quotation_code: 'QT-002',
    customer: 'Minera Andina', document: '20555666777',
    order_type: 'machinery_sale', item_description: 'Cargador Frontal Komatsu WA380',
    advisor: 'Carlos Ramírez', amount: 260000, date: '2026-04-16',
    status: 'Generated'
  },
]

export const SalesProvider = ({ children }) => {
  const [salesOrders, setSalesOrders] = useState(fakeSalesOrders)

  const createFromQuotation = (quotation) => {
    const newOrder = {
      id:               Date.now(),
      code:             `SO-${String(salesOrders.length + 1).padStart(3, '0')}`,
      quotation_code:   quotation.code,
      customer:         quotation.customer,
      document:         quotation.document,
      order_type:       quotation.quotation_type,
      item_description: quotation.equipment,
      advisor:          quotation.advisor,
      amount:           quotation.amount,
      date:             quotation.date,
      status:           'Generated',  
    }
    setSalesOrders(prev => [newOrder, ...prev])
  }

  const updateOrder = (updated) =>
    setSalesOrders(prev => prev.map(o => o.id === updated.id ? updated : o))

  const deleteOrder = (id) =>
    setSalesOrders(prev => prev.filter(o => o.id !== id))

  return (
    <SalesContext.Provider value={{ salesOrders, createFromQuotation, updateOrder, deleteOrder }}>
      {children}
    </SalesContext.Provider>
  )
}

export const useSales = () => useContext(SalesContext)