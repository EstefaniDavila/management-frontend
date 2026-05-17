import React, { useState, useEffect } from 'react'
import CustomerHistoryTable from '@/composables/admin/marketing/customerHistory/tables/CustomerHistoryTable'
import CustomerDetailModal from '@/composables/admin/marketing/customerHistory/modals/CustomerDetailModal'
import useCrud from '@/hooks/useCrud'

const CustomerHistory = () => {
  const { getModel } = useCrud('/api/v1/admin/clients')

  const [customers, setCustomers]       = useState([])
  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch]             = useState('')
  const [searchFields, setSearchFields] = useState(['business_name', 'contact_name', 'email'])
  const [selected, setSelected]         = useState(null)
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [totalPages, setTotalPages]     = useState(0)
  const [isLoading, setIsLoading]       = useState(true)

  const fetchCustomers = async () => {
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
      const clientsArray = response.clients || response.data || []
      
      const formattedData = clientsArray.map(item => ({
        id: item.id,
        code: item.code || '-',
        business_name: item.business_name || item.contact_name || 'Sin Nombre',
        document_type: item.document_type || 'RUC/DNI',
        document_number: item.document_number || '-',
        contact_name: item.contact_name || '',
        phone: item.phone || '',
        email: item.email || '',
        type: item.client_category || 'General',
        address: item.address || '',
        status: item.status || 'active',
        priority: item.client_category || 'CP',
        tracking: [],
        _original: item
      }))

      setCustomers(formattedData)
      setTotalPages(response.total_pages || Math.ceil(formattedData.length / pagination.pageSize))
    } catch (error) {
      console.error("Error al cargar historial de clientes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [pagination.pageIndex, pagination.pageSize, search])

  const handleView = (customer) => {
    setSelected(customer)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="flex flex-col gap-4">

        {/* Título */}
        <div>
          <h1 className="text-base font-semibold">Historial de Clientes</h1>
          <p className="text-xs text-muted-foreground">
            Consulta el historial de cotizaciones por cliente
          </p>
        </div>

        {/* Tabla */}
        <div className="border rounded-xl bg-card shadow-sm">
          <div className="px-4 pt-4 pb-2 border-b">
            <p className="text-sm font-medium">Clientes registrados</p>
          </div>
          <div className="p-4">
            <CustomerHistoryTable
              data={customers}
              fetchData={fetchCustomers}
              pagination={pagination}
              setPagination={setPagination}
              totalPages={totalPages}
              search={search}
              setSearch={setSearch}
              searchFields={searchFields}
              setSearchFields={setSearchFields}
              onView={handleView}
            />
          </div>
        </div>

      </div>

      <CustomerDetailModal
        isOpen={isModalOpen}
        handleClose={() => { setIsModalOpen(false); setSelected(null) }}
        customer={selected}
      />
    </>
  )
}

export default CustomerHistory