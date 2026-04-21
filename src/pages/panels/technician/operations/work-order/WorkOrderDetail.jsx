import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from 'react-router-dom'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select"

export default function WorkOrderDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("diagnosis")

  const workOrder = {
    equipment: "Excavadora CAT 320",
    customer: "Constructora Lima SAC",
    date: "2026-04-15",
    technician: "Juan Perez"
  }
  //BACKEND
  const [diagnosisResult, setDiagnosisResult] = useState(null)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

      {/* 🔹 TAB HEADERS */}
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="info">Información</TabsTrigger>
        <TabsTrigger value="diagnosis">Diagnóstico</TabsTrigger>
        <TabsTrigger 
          value="maintenance"
          disabled={diagnosisResult !== "SOLVED"}
        >
          Mantenimiento
        </TabsTrigger>

        <TabsTrigger value="evidence">Evidencias</TabsTrigger>
      </TabsList>

      {/* 🔹 CONTENIDO */}

      <TabsContent value="info">
        <div>Info de la orden...</div>
      </TabsContent>

      <TabsContent value="diagnosis">
        <div className="p-4 space-y-6">

          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border">
            
            <div>
              <p className="text-sm text-gray-500">Equipo</p>
              <p className="font-medium">{workOrder.equipment}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Cliente</p>
              <p className="font-medium">{workOrder.customer}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="font-medium">{workOrder.date}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Técnico</p>
              <p className="font-medium">{workOrder.technician}</p>
            </div>

          </div>

          {/* 🔹 FORM STYLE */}
          <div className="space-y-4">

            {/* Diagnóstico */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Diagnóstico</label>
              <textarea 
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Describe el problema encontrado..."
              />
            </div>

            {/* Resultado */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Resultado del diagnóstico</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un estado para el diagnostico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Estado del diagnostico</SelectLabel>
                    <SelectItem value="solved">Se puede resolver ahora</SelectItem>
                    <SelectItem value="pieces">Se necesitan nuevas piezas</SelectItem>
                    <SelectItem value="scaling">Se necesita escalar</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Botón */}
            <div className="flex justify-end">
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Guardar diagnóstico
              </button>
            </div>

          </div>

        </div>
      </TabsContent>

      <TabsContent value="maintenance">
        <div>Mantenimiento</div>
      </TabsContent>

      <TabsContent value="evidence">
        <div>Evidencia</div>
      </TabsContent>

    </Tabs>
  )
}