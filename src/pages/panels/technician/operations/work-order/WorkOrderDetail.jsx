import { useLocation } from 'react-router-dom'
import { AlertTriangle, Wrench, Clock, Hash, Building2, CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import OpenWorkOrderSection from '@/composables/technician/operations/work-order/sections/OpenWorkOrderSection'
import InProgressWorkOrderSection from '@/composables/technician/operations/work-order/sections/InProgressWorkOrderSection'

const formatDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const statusColors = {
  OPEN: "bg-yellow-100 text-yellow-800",
  CLOSED: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
}

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-orange-100 text-orange-800",
  HIGH: "bg-red-100 text-red-800",
}

export default function WorkOrderDetail() {
  const { state } = useLocation()
  const workOrder = state?.workOrder
  const maintenance = workOrder?.maintenance
  const vehicle = maintenance?.enterprise_vehicle
  
  return (
    <div className="p-6 space-y-4">
      {/* INFO CARD */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Orden de trabajo : {workOrder?.code}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* TOP INFO */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
            <div className="border rounded-md p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Wrench size={13} />
                Tipo
              </div>
              <p className="font-medium text-sm truncate">
                {maintenance?.maintenance_type}
              </p>
            </div>

            <div className="border rounded-md p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <AlertTriangle size={13} />
                Prioridad
              </div>
              <Badge className={`${priorityColors[maintenance?.priority]} mt-1`}>
                {maintenance?.priority}
              </Badge>
            </div>

            <div className="border rounded-md p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={13} />
                Estado
              </div>
              <Badge  className={`${statusColors[workOrder?.status]} mt-1`}>
                {workOrder?.status}
              </Badge>
            </div>

            <div className="border rounded-md p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 size={13} />
                Cliente
              </div>
              <p className="font-medium text-sm truncate">
                {maintenance?.client?.business_name}
              </p>
            </div>

            <div className="border rounded-md p-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays size={13} />
                Programado
              </div>
              <p className="font-medium text-sm">
                {formatDate(workOrder?.scheduled_date)}
              </p>
            </div>
          </div>
          {/* EQUIPO */}
          <div className="border rounded-md p-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Equipo</p>
                <p className="font-medium truncate">{vehicle?.product?.name || "-"}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Serie</p>
                <p className="font-medium truncate">{vehicle?.serial || "-"}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Año</p>
                <p className="font-medium">{vehicle?.manufacture_year || "-"}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Horas usadas</p>
                <p className="font-medium">{vehicle?.hours_used || 0} hrs</p>
              </div>
            </div>

          </div>
          {/* DESCRIPCIÓN */}
          <div className="border rounded-md p-3">
            <p className="text-xs text-muted-foreground mb-1">
              Descripción del mantenimiento
            </p>
            <p className="text-sm">{maintenance?.description || "-"}</p>
          </div>
        </CardContent>
      </Card>

      {maintenance?.status === "OPEN" && (
        <OpenWorkOrderSection
          workOrder={workOrder}
        />
      )}

      {maintenance?.status === "IN_PROGRESS" && (
        <InProgressWorkOrderSection
          workOrder={workOrder}
        />
      )}

    </div>
  )
}