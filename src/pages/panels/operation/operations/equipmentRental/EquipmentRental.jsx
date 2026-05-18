import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Package, Truck, CheckCircle2 } from 'lucide-react'
import TableRentals from '@/composables/operation/operations/equipmentRental/tables/EquipmentRentalTable'
import useFetchRentals from '@/composables/operation/operations/equipmentRental/hooks/useFetchRentals'
import ModalNewRental from '@/composables/operation/operations/equipmentRental/modals/ModalNewRental'
import ModalNewDispatch from '@/composables/operation/operations/equipmentRental/modals/ModalNewDispatch'
import { useAuth } from '@/providers/UserContext'

export default function EquipmentRental() {
  const { user } = useAuth()
  const [typeModal, setTypeModal] = useState("")
  const [rental, setRental] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  const [search, setSearch] = useState("")
  const [searchFields, setSearchFields] = useState(["code,name"])

  const searchParams = {search, fields: searchFields.join(',') }
  const { data: rentalsData, refetch: refetchRentals } = useFetchRentals(pagination, searchParams)
  const totalPages = Math.ceil((rentalsData?.rowCount || 0 )/ pagination.pageSize) || 0

  const activeRentals = rentalsData?.rows.length || 0
  const pendingDeliveries = rentalsData?.rows.filter(r => r.status === 'PENDING').length || 0
  const delivered = rentalsData?.rows.filter(r => r.status === 'DELIVERED').length || 0

  const handleOpenModal = (type, data = null) => {
    setIsModalOpen(true)
    setTypeModal(type)
    setRental(data)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTypeModal('')
    setRental(null)
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Renta de Equipos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestiona la entrega y disponibilidad de máquinas para alquiler.
          </p>
        </div>
        <Button onClick={() => handleOpenModal("new")} className="gap-2">
          <Plus className="h-4 w-4" /> Nueva Renta
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Rentas Gestionadas</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRentals}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Entregas Pendientes</CardTitle>
            <Truck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground mt-1">Equipos en preparación</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Equipos Entregados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delivered}</div>
            <p className="text-xs text-muted-foreground mt-1">Notificados a Comercial</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="text-lg">Registro de Entregas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TableRentals
            handleOpenModal={handleOpenModal}
            fetchData={refetchRentals}
            data={rentalsData?.rows || []}
            pagination={pagination}
            setRental={setRental}
            setTypeModal={setTypeModal}
            totalPages={totalPages}
            search={search}
            setSearch={setSearch}
            searchFields={searchFields}
            setSearchFields={setSearchFields}
          />
        </CardContent>
      </Card>
      {typeModal === 'new' && (
        <ModalNewRental
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          typeModal={typeModal}
          fetchData={refetchRentals}
        />
      )}
      {/* {typeModal === 'edit' && (
        <ModalNewMaintenance
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          typeModal={typeModal}
          fetchData={refetchRentals}
        />
      )} */}
      {typeModal === 'deliver' && (
        <ModalNewDispatch
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          typeModal={typeModal}
          fetchData={refetchRentals}
          rental={rental}
          user={user}
        />
      )}
    </div>
  )
}
