import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from 'react-router-dom'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select"
import { AlertTriangle, FileText, Settings, Wrench, Clock, Hash, UploadCloud, ImageIcon, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WorkOrderDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("info")
  const fileInputRef = useRef(null)

  const workOrder = {
    equipment: "Excavadora CAT 320",
    customer: "Constructora Lima SAC",
    date: "2026-04-15",
    technician: "Juan Perez",
    type: "Mantenimiento Correctivo",
    area: "Producción y Operaciones",
    clientReport: "El equipo presenta pérdida de potencia al intentar levantar carga pesada. Además, se escuchan fuertes ruidos metálicos anormales provenientes de la zona del motor hidráulico. En la cabina, el tablero indica alerta de sobrecalentamiento después de apenas 2 horas de uso continuo bajo el sol.",
    machineDetails: {
      model: "320 GC",
      series: "CAT00320TXYZ12345",
      horometer: "4,500 hrs"
    }
  }
  
  //BACKEND
  const [diagnosisResult, setDiagnosisResult] = useState(null)
  const [evidences, setEvidences] = useState([])

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const newEvidences = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      date: new Date().toLocaleTimeString(),
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    }))

    setEvidences(prev => [...newEvidences, ...prev])
  }

  const removeEvidence = (idToRemove) => {
    setEvidences(prev => prev.filter(ev => ev.id !== idToRemove))
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

      {/* 🔹 TAB HEADERS */}
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="info">Información</TabsTrigger>
        <TabsTrigger value="diagnosis">Diagnóstico</TabsTrigger>
        <TabsTrigger 
          value="maintenance"
          disabled={diagnosisResult !== "solved"}
        >
          Mantenimiento
        </TabsTrigger>

        <TabsTrigger value="evidence">Evidencias</TabsTrigger>
      </TabsList>

      {/* 🔹 CONTENIDO */}

      <TabsContent value="info">
        <div className="p-4 space-y-6">
          <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-1">Reporte del Cliente / Área Solicitante</h2>
                <p className="text-sm text-blue-800/80 dark:text-blue-200/80 mb-3">Información general proveída para la ejecución de esta orden</p>
                <div className="bg-white dark:bg-black/20 rounded-lg p-4 shadow-sm border border-blue-50 dark:border-blue-800/30">
                  <p className="text-sm italic text-foreground leading-relaxed">
                    "{workOrder.clientReport}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-xl p-5 bg-card shadow-sm">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-4">
                <Wrench className="h-4 w-4" />
                Detalles del Servicio
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tipo de Orden</p>
                  <p className="text-sm font-medium">{workOrder.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Área Origen</p>
                  <p className="text-sm font-medium">{workOrder.area} / Renta de Equipos</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Asignado A</p>
                  <p className="text-sm font-medium">{workOrder.technician}</p>
                </div>
              </div>
            </div>

            <div className="border rounded-xl p-5 bg-card shadow-sm">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-4">
                <Settings className="h-4 w-4" />
                Especificaciones de Máquina
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-3 border-dashed">
                  <div className="bg-muted p-2 rounded-md"><Hash className="h-4 w-4 text-muted-foreground" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Modelo / Serie</p>
                    <p className="text-sm font-semibold">{workOrder.machineDetails.model} <span className="font-mono text-muted-foreground ml-2 text-xs">{workOrder.machineDetails.series}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-md"><Clock className="h-4 w-4 text-muted-foreground" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Horómetro Registrado</p>
                    <p className="text-sm font-semibold">{workOrder.machineDetails.horometer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        <div className="p-4">
          <p className="text-muted-foreground">Opciones de mantenimiento habilitadas tras el diagnóstico.</p>
        </div>
      </TabsContent>

      <TabsContent value="evidence">
        <div className="p-4 space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">Registro de Evidencias</h2>
            <p className="text-sm text-muted-foreground">Sube fotografías de las fallas, piezas dañadas o del estado general del equipo para respaldar tu diagnóstico.</p>
          </div>

          {/* Upload Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-colors rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer text-center group"
          >
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <div className="bg-background p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Haz clic para subir imágenes</h3>
            <p className="text-xs text-muted-foreground">Soporta PNG, JPG, JPEG (Max. 5MB por imagen)</p>
          </div>

          {/* Gallery */}
          {evidences.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                Imágenes Adjuntas ({evidences.length})
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {evidences.map((evidence) => (
                  <div key={evidence.id} className="group relative border rounded-xl overflow-hidden bg-muted/30 aspect-square flex flex-col">
                    <div className="relative flex-1 bg-black/5 flex items-center justify-center overflow-hidden">
                      <img 
                        src={evidence.url} 
                        alt={evidence.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); removeEvidence(evidence.id); }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-2 bg-card border-t flex flex-col">
                      <span className="text-[10px] font-medium truncate" title={evidence.name}>{evidence.name}</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] text-muted-foreground">{evidence.size}</span>
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </TabsContent>

    </Tabs>
  )
}