import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/providers/UserContext'
import { Bug, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import axios from 'axios'

export default function BugReportModal({ onSuccess }) {
  console.log('onSuccess recibido:', onSuccess)
  const { user } = useAuth()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiClassification, setAiClassification] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps_to_reproduce: '',
  })

  const modules = [
    { value: 'sales', label: 'Ventas (Sales)' },
    { value: 'rentals', label: 'Rentas (Rentals)' },
    { value: 'maintenance', label: 'Mantenimiento (Maintenance)' },
    { value: 'inventory', label: 'Inventario (Inventory)' },
    { value: 'dispatch', label: 'Despacho (Dispatch)' },
    { value: 'products', label: 'Productos (Products)' },
    { value: 'clients', label: 'Clientes (Clients)' },
    { value: 'leads', label: 'Leads' },
    { value: 'other', label: 'Otro (Other)' },
  ]

  const severities = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'critical', label: 'Crítica' },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Reset classification if user types more after analysis
    if (name === 'description' && aiClassification) {
      setAiClassification(null)
    }
  }

  const handleAnalyzeAI = async () => {
    if (!formData.description.trim()) {
      toast({
        title: 'Descripción requerida',
        description: 'Escribe el problema para que Claude lo analice.',
        variant: 'destructive',
      })
      return
    }

    setAnalyzing(true)
    try {
      const backendHost = import.meta.env.VITE_BACKEND_HOST
      const response = await axios.post(`${backendHost}/api/v1/support/classify_incident`, {
        description: formData.title + ". " + formData.description
      })
      
      setAiClassification(response.data)
      if (response.data.steps) {
        setFormData((prev) => ({
          ...prev,
          steps_to_reproduce: response.data.steps
        }))
      }
      toast({
        title: 'Análisis Completo',
        description: 'Claude ha clasificado el incidente correctamente.',
      })
    } catch (error) {
      toast({
        title: 'Error de IA',
        description: 'No se pudo conectar con Claude API.',
        variant: 'destructive',
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: 'Campo requerido',
        description: 'Por favor, introduce un título para el reporte de error.',
        variant: 'destructive',
      })
      return
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Campo requerido',
        description: 'Por favor, introduce una descripción del error.',
        variant: 'destructive',
      })
      return
    }

    if (!aiClassification) {
      toast({
        title: 'Análisis IA Pendiente',
        description: 'Por favor presiona "Analizar Incidente con IA" antes de enviarlo a TI.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    const formattedDescription = `[ANÁLISIS ITIL IA]
Severidad: ${aiClassification.severity_label}
Módulo: ${aiClassification.module}
SLA de Respuesta: ${aiClassification.sla_response}
Justificación: ${aiClassification.analysis}

[DESCRIPCIÓN DEL USUARIO]
${formData.description}`;

    const payload = {
      error_report: {
        ...formData,
        description: formattedDescription,
        module_affected: aiClassification.module,
        severity: aiClassification.severity,
        reported_by_id: user?.id || 'anonymous',
      },
    }

    try {
      const backendHost = import.meta.env.VITE_BACKEND_HOST
      const response = await axios.post(`${backendHost}/api/v1/admin/error_reports`, payload)

      if (response.status === 200 || response.status === 201) {
        toast({
          title: 'Reporte enviado con éxito',
          description: 'Gracias por tu reporte. Nuestro equipo técnico lo revisará pronto.',
        })

        setFormData({
          title: '',
          description: '',
          steps_to_reproduce: '',
        })
        setAiClassification(null)
        setOpen(false)

        if (onSuccess) 
          
                  {
            console.log('llamando onSuccess')
            onSuccess()
        }

      } else {
        throw new Error('Error en la respuesta del servidor')
      }
    } catch (error) {
      console.error('Error al enviar el reporte:', error)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'No se pudo conectar con el servidor. Inténtalo más tarde.'
      toast({
        title: 'Error al enviar reporte',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full text-muted-foreground hover:text-foreground transition-colors"
          title="Reportar un error en el sistema"
        >
          <Bug className="h-5 w-5" />
          <span className="sr-only">Reportar error</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Bug className="h-5 w-5 text-destructive" />
            Reportar un Error / Bug
          </DialogTitle>
          <DialogDescription>
            Cuéntanos qué falló en el sistema para que podamos solucionarlo lo antes posible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">

          <div className="grid gap-2">
            <Label htmlFor="title" className="font-semibold text-sm">Título del Error</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ej: Error al generar reporte de ventas"
              disabled={loading}
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="font-semibold text-sm">Descripción del Problema</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe detalladamente qué estabas haciendo y qué ocurrió..."
              rows={3}
              disabled={loading || analyzing}
              className="resize-none"
            />
          </div>

          {!aiClassification ? (
            <Button 
              type="button" 
              variant="secondary" 
              className="w-full gap-2 border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100" 
              onClick={handleAnalyzeAI}
              disabled={analyzing || loading}
            >
              {analyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 text-indigo-500" />
              )}
              {analyzing ? 'Analizando con Claude AI...' : 'Analizar Severidad con IA (ITIL)'}
            </Button>
          ) : (
            <div className="p-3 border rounded-lg bg-green-50 border-green-200 text-sm">
              <div className="flex items-center gap-2 font-bold text-green-800 mb-2">
                <CheckCircle2 className="h-4 w-4" /> Clasificación IA Exitosa
              </div>
              <div className="grid grid-cols-2 gap-2 text-green-900">
                <div><strong>Nivel:</strong> {aiClassification.severity_label}</div>
                <div><strong>Módulo:</strong> {aiClassification.module}</div>
                <div className="col-span-2"><strong>SLA (Respuesta):</strong> {aiClassification.sla_response}</div>
                <div className="col-span-2 text-xs italic mt-1">"{aiClassification.analysis}"</div>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="steps_to_reproduce" className="font-semibold text-sm">Pasos para Reproducir</Label>
            <Textarea
              id="steps_to_reproduce"
              name="steps_to_reproduce"
              value={formData.steps_to_reproduce}
              onChange={handleInputChange}
              placeholder="Ej:&#10;1. Ir a Reportes&#10;2. Seleccionar Ventas&#10;3. Elegir mes actual&#10;4. Click en Generar"
              rows={4}
              disabled={loading}
              className="font-mono text-xs"
            />
          </div>

          {user && (
            <div className="text-[10px] text-muted-foreground text-right italic">
              Reportado por usuario: {user.full_name || user.email}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Reporte'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
