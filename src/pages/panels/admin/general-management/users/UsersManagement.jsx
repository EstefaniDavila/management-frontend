import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { TbPlus } from 'react-icons/tb'
import UsersTable from '@/composables/admin/general-management/users/tables/UsersTable'
import CreateUserModal from '@/composables/admin/general-management/users/modals/CreateUserModal'
import UpdateUserModal from '@/composables/admin/general-management/users/modals/UpdateUserModal'
import useCrud from '@/hooks/useCrud'
import useEntityMutation from '@/hooks/useEntityMutation'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner' // O la librería de notificaciones que uses en el frontend
import axios from 'axios'

const backend_host = import.meta.env.VITE_BACKEND_HOST

const UsersManagement = () => {
  const { getModel, insertModel } = useCrud('/api/v1/admin/users')
  const userMutation = useEntityMutation({ entityName: 'user' })
  const location = useLocation()

  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch] = useState('')
  const [searchFields, setSearchFields] = useState(['document_number', 'email', 'first_name', 'last_name'])
  
  const [selected, setSelected] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Acceso a datos precargados de AccessRequests
  const [prefilledData, setPrefilledData] = useState(null)
  const [accessRequestId, setAccessRequestId] = useState(null)

  useEffect(() => {
    if (location.state?.fromAccessRequest && location.state?.prefilledData) {
      setPrefilledData(location.state.prefilledData)
      setAccessRequestId(location.state.prefilledData.id)
      setIsCreateOpen(true)
      // Limpiar el state para que no vuelva a abrirse si recarga (opcional, React Router maneja esto de varias formas)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const fetchUsers = async () => {
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
      const dataArray = response.users || response.data || []
      
      setUsers(dataArray)
      setTotalPages(response.total_pages || 1)
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [pagination.pageIndex, pagination.pageSize, search])

  const refetchData = () => fetchUsers()

  const handleCreate = async (payload) => {
    try {
      await insertModel(payload)
      refetchData()
      setIsCreateOpen(false)
      setPrefilledData(null)
      
      // Si venía de un AccessRequest, marcarlo como completado en background
      if (accessRequestId) {
        try {
          await axios.put(`${backend_host}/api/v1/admin/access_requests/${accessRequestId}/complete`)
          toast.success("Solicitud de acceso marcada como completada automáticamente.")
        } catch (e) {
          console.error("Error al completar la solicitud de acceso:", e)
        }
        setAccessRequestId(null)
      }
      toast.success("Usuario creado exitosamente")
    } catch (e) {
      console.error("Error al crear usuario", e)
    }
  }

  const handleUpdate = (payload) => {
    userMutation.mutate({
      action: 'update',
      id: payload.id,
      entity: payload,
      endpoint: `/api/v1/admin/users/${payload.id}`
    }, {
      onSuccess: () => {
        refetchData()
        setIsUpdateOpen(false)
        setSelected(null)
      }
    })
  }

  const handleDelete = (user) => {
    userMutation.mutate({
      action: 'delete',
      id: user.id,
      endpoint: `/api/v1/admin/users/${user.id}`
    }, {
      onSuccess: () => refetchData(),
      onError: (err) => {
        // En caso que el backend devuelva un error (ej. Foreign Key)
        console.error(err);
      }
    })
  }

  const handleToggleStatus = async (user) => {
    try {
      await customMutate('patch', `/api/v1/admin/users/${user.id}/toggle_status`)
      refetchData()
    } catch (error) {
      console.error("Error al cambiar estado", error)
    }
  }

  const handleResetPassword = async (user) => {
    const confirmReset = window.confirm(`¿Estás seguro que deseas reiniciar la contraseña de este usuario a su número de documento?`)
    if (!confirmReset) return

    try {
      await customMutate('patch', `/api/v1/admin/users/${user.id}/reset_password`)
      alert('Contraseña reiniciada correctamente.')
    } catch (error) {
      console.error("Error al resetear contraseña", error)
    }
  }

  const handleView = (user) => { setSelected(user); /* Podría abrir un modal de View si se desea */ }
  const handleEdit = (user) => { setSelected(user); setIsUpdateOpen(true) }

  return (
    <>
      <div className="flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Gestión de Usuarios</h1>
            <p className="text-xs text-muted-foreground">Administra los usuarios y roles registrados en el sistema</p>
          </div>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <TbPlus size={16} className="mr-1" /> Nuevo Usuario
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-xl bg-card shadow-sm">
          <div className="px-4 pt-4 pb-2 border-b">
            <p className="text-sm font-medium">Usuarios registrados</p>
          </div>
          <div className="p-4">
            <UsersTable
              data={users}
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
              onToggleStatus={handleToggleStatus}
              onResetPassword={handleResetPassword}
            />
          </div>
        </div>

      </div>

      <CreateUserModal
        isOpen={isCreateOpen}
        handleClose={() => { setIsCreateOpen(false); setPrefilledData(null); setAccessRequestId(null) }}
        onCreate={handleCreate}
        prefilledData={prefilledData}
      />

      <UpdateUserModal
        isOpen={isUpdateOpen}
        handleClose={() => { setIsUpdateOpen(false); setSelected(null) }}
        user={selected}
        onUpdate={handleUpdate}
      />
    </>
  )
}

export default UsersManagement
