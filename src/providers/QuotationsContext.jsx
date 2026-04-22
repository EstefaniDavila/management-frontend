import { createContext, useContext, useState } from 'react'

const QuotationsContext = createContext()

export const QuotationsProvider = ({ children }) => {
  const [quotations, setQuotations] = useState([])

  return (
    <QuotationsContext.Provider value={{ quotations, setQuotations }}>
      {children}
    </QuotationsContext.Provider>
  )
}

export const useQuotations = () => useContext(QuotationsContext)