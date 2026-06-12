import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { TbPlus } from 'react-icons/tb'
import CustomersTable from '@/composables/admin/marketing/customers/tables/CustomersTable'
import CreateCustomerModal from '@/composables/admin/marketing/customers/modals/CreateCustomerModal'
import UpdateCustomerModal from '@/composables/admin/marketing/customers/modals/UpdateCustomerModal'
import ViewCustomerModal from '@/composables/admin/marketing/customers/modals/ViewCustomerModal'
import useCrud from '@/hooks/useCrud'
import useEntityMutation from '@/hooks/useEntityMutation'
import RenderProfiler from '@/components/RenderProfiler'

const Customers = () => {
  const { getModel } = useCrud('/api/v1/admin/clients')
  const clientMutation = useEntityMutation({ entityName: 'client' })

  const [customers, setCustomers]       = useState([])
  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch]             = useState('')
  const [searchFields, setSearchFields] = useState(['business_name', 'contact_name', 'email'])
  const [selected, setSelected]         = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen]     = useState(false)
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
      
      const getStaticRubro = (name) => {
        const n = (name || '').toLowerCase();
        if (n.includes('minera') || n.includes('minero') || n.includes('cristobal') || n.includes('horizonte') || n.includes('andes')) return 'mineria';
        if (n.includes('cargo') || n.includes('trans') || n.includes('logistica')) return 'transporte';
        if (n.includes('energia') || n.includes('power') || n.includes('electric')) return 'energia';
        return 'construccion';
      }

      const formattedData = clientsArray.map(item => ({
        id: item.id,
        code: item.code || '-',
        business_name: item.business_name || item.contact_name || 'Sin Nombre',
        document_type: item.document_type || 'RUC/DNI',
        document_number: item.document_number || '-',
        contact_name: item.contact_name || '',
        phone: item.phone || '',
        email: item.email || '',
        client_category: item.client_category || 'construccion',
        address: item.address || '',
        status: item.status || 'active',
        priority: 'NC', // Todos son nuevos ("Cliente Nuevo"), no CP
        type: getStaticRubro(item.business_name || item.contact_name),
        tracking: [],
        _original: item
      }))

      setCustomers(formattedData)
      setTotalPages(response.total_pages || Math.ceil(formattedData.length / pagination.pageSize))
    } catch (error) {
      console.error("Error al cargar clientes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [pagination.pageIndex, pagination.pageSize, search])

  const refetchData = () => fetchCustomers()

  const handleCreate = (newC) => {
    clientMutation.mutate({
      action: 'create',
      entity: newC,
      endpoint: '/api/v1/admin/clients'
    }, {
      onSuccess: () => {
        refetchData()
        setIsCreateOpen(false)
      }
    })
  }

  const handleUpdate = (updated) => {
    const { id, code, tracking, _original, type, priority, ...cleanPayload } = updated

    clientMutation.mutate({
      action: 'update',
      id: id,
      entity: cleanPayload,
      endpoint: `/api/v1/admin/clients/${id}`
    }, {
      onSuccess: () => {
        refetchData()
        setIsUpdateOpen(false)
        setSelected(null)
      }
    })
  }

  const handleDelete = (customer) => {
    clientMutation.mutate({
      action: 'delete',
      id: customer.id,
      endpoint: `/api/v1/admin/clients/${customer.id}`
    }, {
      onSuccess: () => refetchData()
    })
  }

  const handleView   = (customer) => { setSelected(customer); setIsViewOpen(true) }
  const handleEdit   = (customer) => { setSelected(customer); setIsUpdateOpen(true) }

  return (
    <>
      <RenderProfiler id="Admin-Customers-Dashboard">
        <div className="flex flex-col gap-4">

          {/* Título + botón */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold">Gestión de Clientes</h1>
              <p className="text-xs text-muted-foreground">Administra los clientes registrados en el sistema</p>
            </div>
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              <TbPlus size={16} className="mr-1" /> Nuevo Cliente
            </Button>
          </div>

          {/* Tabla */}
          <div className="border rounded-xl bg-card shadow-sm">
            <div className="px-4 pt-4 pb-2 border-b">
              <p className="text-sm font-medium">Clientes registrados</p>
            </div>
            <div className="p-4">
              <RenderProfiler id="Admin-Customers-TanStack-Table">
                <CustomersTable
                  data={customers}
                  fetchData={refetchData}
                  pagination={pagination}
                  setPagination={setPagination}
                  totalPages={totalPages}
                  search={search}
                  setSearch={setSearch}
                  searchFields={searchFields}
                  setSearchFields={setSearchFields}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </RenderProfiler>
            </div>
          </div>

        </div>
      </RenderProfiler>

      <RenderProfiler id="Admin-CreateCustomer-Modal">
        <CreateCustomerModal
          isOpen={isCreateOpen}
          handleClose={() => setIsCreateOpen(false)}
          onCreate={handleCreate}
        />
      </RenderProfiler>

      <RenderProfiler id="Admin-UpdateCustomer-Modal">
        <UpdateCustomerModal
          isOpen={isUpdateOpen}
          handleClose={() => { setIsUpdateOpen(false); setSelected(null) }}
          customer={selected}
          onUpdate={handleUpdate}
        />
      </RenderProfiler>

      <RenderProfiler id="Admin-ViewCustomer-Modal">
        <ViewCustomerModal
          isOpen={isViewOpen}
          handleClose={() => { setIsViewOpen(false); setSelected(null) }}
          customer={selected}
        />
      </RenderProfiler>
    </>
  )
}

export default Customers