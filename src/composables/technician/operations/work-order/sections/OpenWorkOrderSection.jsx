import React, {useState, useMemo} from 'react'
import useEntityMutation from '@/hooks/useEntityMutation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/providers/UserContext'

export default function OpenWorkOrderSection({ workOrder }) {
  const { user } = useAuth()
  const [diagnosisStarted, setDiagnosisStarted] = useState(workOrder?.status === "IN_PROGRESS")
  const [formData, setFormData] = useState({
    diagnosis: "",
    diagnosisResult: ""
  })
  const [formDataAction, setFormDataAction] = useState({
    action: "Realizando Diagnostico",
    description: "Diagnosticando el vehículo para determinar fallas y posibles soluciones.",
    evidence: "",
    performed_by_id: user?.roleable?.id || "",
    work_order_id: workOrder?.id || "",
  })
  // useMemo(()=>{
  //   if (workOrder) {
  //     setFormDataAction({
  //       diagnosis: workOrder.diagnosis || '',
  //       diagnosis_result: workOrder.diagnosis_result || '',
  //     })
  //   }
  // }, [workOrder])
  const [diagnosis, setDiagnosis] = useState(workOrder?.diagnosis || "")
  const [diagnosisResult, setDiagnosisResult] = useState(workOrder?.diagnosis_result || "")
  const mutationAction = useEntityMutation({entityName: "work_order_action"})

  const handleStartDiagnostic = async () => {
    setDiagnosisStarted(true)
    mutationAction.mutate(
      { action: 'create', entity: formDataAction, endpoint: '/api/v1/manager/work_order_actions' },
      handleClose(),
    )
  }

  const handleSubmitDiagnostic = async () => {

    // PATCH WORK ORDER
    // diagnosis
    // diagnosis_result

    // CREATE ACTION
    // "Diagnóstico enviado"

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
                placeholder="Describe detalladamente el diagnóstico realizado..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Resultado del diagnóstico
              </label>

              <Input
                placeholder="Cambiar aceite, ajustar engranajes..."
                value={diagnosisResult}
                onChange={(e) => setDiagnosisResult(e.target.value)}
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