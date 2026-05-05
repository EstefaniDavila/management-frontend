import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Package, Truck, CheckCircle2 } from 'lucide-react'
import EquipmentRentalTable from '@/composables/operation/operations/equipmentRental/tables/EquipmentRentalTable'
import CreateRentalModal from '@/composables/operation/operations/equipmentRental/modals/CreateRentalModal'
import DeliveryReportModal from '@/composables/operation/operations/equipmentRental/modals/DeliveryReportModal'

export default function EquipmentRental() {
  const [rentals, setRentals] = useState([
    {
      id: 'REN-0042',
      customer: 'Minera Los Andes',
      equipment: 'Excavadora CAT 320 (CAT-001)',
      deliveryDate: '2026-05-01T08:00',
      status: 'Entregada',
      notes: 'Entregada en campamento minero.'
    },
    {
      id: 'REN-0045',
      customer: 'Constructora Horizonte',
      equipment: 'Volquete Volvo A40 (VOL-002)',
      deliveryDate: '2026-05-15T10:00',
      status: 'Pendiente',
      notes: 'Requiere operador por los primeros 3 días.'
    }
  ])

  // Pagination & Search states for the table
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [search, setSearch] = useState('')
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedRental, setSelectedRental] = useState(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const handleSaveRental = (newRental) => {
    setRentals(prev => [newRental, ...prev])
  }

  const handleOpenReport = (rental) => {
    setSelectedRental(rental)
    setIsReportModalOpen(true)
  }

  // Calculate metrics
  const activeRentals = rentals.length
  const pendingDeliveries = rentals.filter(r => r.status === 'Pendiente').length
  const delivered = rentals.filter(r => r.status === 'Entregada').length

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
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
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
          <EquipmentRentalTable 
            data={rentals}
            fetchData={async () => {}}
            pagination={pagination}
            setPagination={setPagination}
            search={search}
            setSearch={setSearch}
            totalPages={1}
            onOpenReport={handleOpenReport}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateRentalModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSave={handleSaveRental}
      />

      <DeliveryReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        rental={selectedRental}
      />
    </div>
  )
}
