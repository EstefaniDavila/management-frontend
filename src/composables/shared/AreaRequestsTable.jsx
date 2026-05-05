import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/custom/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, EyeIcon } from 'lucide-react'

const initialRequests = [
  { id: 'REQ-001', from: 'Comercial', to: 'Operaciones', type: 'Completar Cotización', status: 'Pendiente', date: '2024-10-12', detail: 'Faltan datos del cliente para alquiler' },
  { id: 'REQ-002', from: 'Operaciones', to: 'Logística', type: 'Revisión Técnica', status: 'En Progreso', date: '2024-10-14', detail: 'Revisar repuestos para mantenimiento' },
  { id: 'REQ-003', from: 'Admin', to: 'Comercial', type: 'Actualización Datos', status: 'Completado', date: '2024-10-15', detail: 'Actualizar pipeline' },
]

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function AreaRequestsTable({ currentArea, role }) {
  const [activeTab, setActiveTab] = useState('received')
  const [adminFilter, setAdminFilter] = useState('Todas')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [allRequests, setAllRequests] = useState(() => {
    const stored = localStorage.getItem('area_requests_data')
    if (stored) return JSON.parse(stored)
    localStorage.setItem('area_requests_data', JSON.stringify(initialRequests))
    return initialRequests
  })

  // Listen to cross-tab or manual storage events
  React.useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('area_requests_data')
      if (stored) setAllRequests(JSON.parse(stored))
    }
    window.addEventListener('storage', handleStorage)
    // Custom event to handle same-page updates
    window.addEventListener('requests_updated', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('requests_updated', handleStorage)
    }
  }, [])

  const handleCreateRequest = () => {
    // Aquí iría la lógica para agregar el del modal, si fuera funcional
    setIsDialogOpen(false)
  }
  
  // Filter based on role or area
  const requests = allRequests.filter(req => {
    if (role === 'Admin') {
      if (adminFilter === 'Todas') return true
      return req.from === adminFilter || req.to === adminFilter
    }
    if (activeTab === 'received') return req.to === currentArea
    if (activeTab === 'sent') return req.from === currentArea
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">Solicitudes entre Áreas</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nueva Solicitud
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Solicitud</DialogTitle>
              <DialogDescription>
                Genera una petición para que otra área te apoye con requerimientos técnicos o de llenado de datos.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="toArea" className="text-right">
                  Área Destino
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona el área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Operaciones">Operaciones</SelectItem>
                    <SelectItem value="Logística">Logística</SelectItem>
                    <SelectItem value="Técnico">Técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reqType" className="text-right">
                  Tipo
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Tipo de solicitud" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completar Cotización">Completar Cotización</SelectItem>
                    <SelectItem value="Revisión Técnica">Revisión Técnica</SelectItem>
                    <SelectItem value="Actualización Datos">Actualización Datos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="detail" className="text-right pt-2">
                  Detalle
                </Label>
                <Textarea
                  id="detail"
                  placeholder="Describe exactamente qué necesitas..."
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Enviar Solicitud</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">Recibidas</TabsTrigger>
            <TabsTrigger value="sent">Enviadas</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {role === 'Admin' && (
          <div className="flex items-center gap-2">
            <Label className="text-black dark:text-white">Filtrar por Área (Admin)</Label>
            <Select value={adminFilter} onValueChange={setAdminFilter}>
              <SelectTrigger className="w-[180px] bg-background text-black dark:text-white">
                <SelectValue placeholder="Seleccionar Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
                <SelectItem value="Operaciones">Operaciones</SelectItem>
                <SelectItem value="Logística">Logística</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Tipo de Solicitud</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.id}</TableCell>
                  <TableCell>{req.from}</TableCell>
                  <TableCell>{req.to}</TableCell>
                  <TableCell>{req.type}</TableCell>
                  <TableCell>{req.date}</TableCell>
                  <TableCell>
                    <Badge variant={req.status === 'Completado' ? 'success' : req.status === 'En Progreso' ? 'warning' : 'outline'}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron solicitudes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
