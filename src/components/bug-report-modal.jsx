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
import { Bug, Loader2 } from 'lucide-react'
import axios from 'axios'

export default function BugReportModal() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    module_affected: 'general',
    severity: 'medium',
    description: '',
    steps_to_reproduce: '',
  })

  const modules = [
    { value: 'sales', label: 'Ventas (Sales)' },
    { value: 'operations', label: 'Operaciones (Operations)' },
    { value: 'inventory', label: 'Inventario (Inventory)' },
    { value: 'logistics', label: 'Logística (Logistics)' },
    { value: 'customers', label: 'Clientes (Customers)' },
    { value: 'reports', label: 'Reportes (Reports)' },
    { value: 'general', label: 'General / Otro' },
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
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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

    setLoading(true)

    // Crear el payload con la estructura requerida
    const payload = {
      error_report: {
        ...formData,
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

        // Limpiar el formulario y cerrar
        setFormData({
          title: '',
          module_affected: 'general',
          severity: 'medium',
          description: '',
          steps_to_reproduce: '',
        })
        setOpen(false)
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
          {/* Título */}
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

          <div className="grid grid-cols-2 gap-4">
            {/* Módulo Afectado */}
            <div className="grid gap-2">
              <Label htmlFor="module_affected" className="font-semibold text-sm">Módulo Afectado</Label>
              <select
                id="module_affected"
                name="module_affected"
                value={formData.module_affected}
                onChange={handleInputChange}
                disabled={loading}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {modules.map((mod) => (
                  <option key={mod.value} value={mod.value} className="bg-background text-foreground">
                    {mod.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Severidad */}
            <div className="grid gap-2">
              <Label htmlFor="severity" className="font-semibold text-sm">Severidad</Label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                disabled={loading}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {severities.map((sev) => (
                  <option key={sev.value} value={sev.value} className="bg-background text-foreground">
                    {sev.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="font-semibold text-sm">Descripción del Problema</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe detalladamente qué estabas haciendo y qué ocurrió..."
              rows={3}
              disabled={loading}
              className="resize-none"
            />
          </div>

          {/* Pasos para reproducir */}
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

          {/* ID de Usuario (Informativo / Oculto) */}
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
