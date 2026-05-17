import React, {useState, useMemo} from 'react'
import { useNavigate } from "react-router-dom"
import useEntityMutation from '@/hooks/useEntityMutation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/providers/UserContext'

export default function OpenWorkOrderSection({ workOrder, setWorkOrder }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [diagnosisStarted, setDiagnosisStarted] = useState(workOrder?.status === "IN_PROGRESS")
  const [formData, setFormData] = useState({
    diagnosis: "",
    diagnosis_result: "",
    status: "CLOSED"
  })
  const [formDataStatus, setFormDataStatus] = useState({
    status: "IN_PROGRESS",
  })
  const [formDataStatusEnd, setFormDataStatusEnd] = useState({
    status: "DIAGNOSTICATED",
  })
  const [formDataAction, setFormDataAction] = useState({
    action: "Realizando Diagnostico",
    description: "Diagnosticando el vehículo para determinar fallas y posibles soluciones.",
    evidence: "",
    performed_by_id: user?.roleable?.id || "",
    work_order_id: workOrder?.id || "",
  })
  const mutationWorkOrder = useEntityMutation({entityName: "work_order"})
  const mutationAction = useEntityMutation({entityName: "work_order_action"})
  const mutationMaintenance = useEntityMutation({entityName: "maintenance"})

  const handleStartDiagnostic = async () => {
    setDiagnosisStarted(true)
    await mutationWorkOrder.mutateAsync(
      { action: 'patch', entity: formDataStatus, endpoint: `/api/v1/manager/work_orders/update_status/${workOrder?.id}` },
    )
    await mutationAction.mutateAsync(
      { action: 'create', entity: formDataAction, endpoint: `/api/v1/manager/work_order_actions` },
    )
    setWorkOrder((prev) => ({
      ...prev,
      status: "IN_PROGRESS"
    }))
  }

  const handleSubmitDiagnostic = async () => {
    await mutationWorkOrder.mutateAsync(
      { action: 'patch', entity: formData, endpoint: `/api/v1/manager/work_orders/update_diagnosis/${workOrder?.id}` },
    )
    await mutationMaintenance.mutateAsync(
      { action: 'patch', entity: formDataStatusEnd, endpoint: `/api/v1/manager/maintenances/update_status/${workOrder?.maintenance?.id}` },
    )
    navigate(-1)
  }

  return (
    <Card>

      <CardHeader>
        <CardTitle>
          Diagnóstico Técnico
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {!diagnosisStarted && workOrder?.status === "OPEN" && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleStartDiagnostic}
            >
              Iniciar Diagnóstico
            </Button>
          </div>
        )}

        {diagnosisStarted && (
          <>

            <div>
              <label className="text-sm font-medium">
                Diagnóstico
              </label>

              <Textarea
                rows={6}
                placeholder="Describe detalladamente el diagnóstico realizado y cual es el problema con el equipo..."
                value={formData.diagnosis}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    diagnosis: e.target.value
                  }))
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Resultado del diagnóstico
              </label>

              <Input
                placeholder="Ingresar toda implicancia necesaria para la solución del problema..."
                value={formData.diagnosis_result}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    diagnosis_result: e.target.value
                  }))
                }}
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmitDiagnostic}
              >
                Enviar Diagnóstico
              </Button>
            </div>

          </>
        )}

      </CardContent>

    </Card>
  )
}