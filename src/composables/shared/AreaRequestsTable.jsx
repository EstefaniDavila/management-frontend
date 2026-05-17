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

import { useAuth } from '@/providers/UserContext'
import useCrud from '@/hooks/useCrud'

export default function AreaRequestsTable({ currentArea, role }) {
  const { user } = useAuth()
  const rolePath = role?.toLowerCase() === 'admin' ? 'admin' :
                   role?.toLowerCase() === 'manager' ? 'manager' :
                   role?.toLowerCase() === 'advisor' ? 'advisor' : 'admin';

  const { getModel, insertModel, updateModel } = useCrud(`/api/v1/${rolePath}/area_requests`)
  const { getModel: getQuotations } = useCrud(`/api/v1/${rolePath === 'advisor' ? 'advisor' : 'admin'}/quotations`)

  const [activeTab, setActiveTab] = useState((role?.toLowerCase() === 'admin' || role?.toLowerCase() === 'manager') ? 'all' : 'received')
  const [adminFilter, setAdminFilter] = useState('Todas')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [allRequests, setAllRequests] = useState([])
  const [quotations, setQuotations] = useState([])
  
  // Form State
  const [formData, setFormData] = useState({
    quotation_id: '',
    area: '',
    name: '',
    description: ''
  })

  // Reply States
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [selectedRequestForReply, setSelectedRequestForReply] = useState(null)
  
  // View States
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedRequestForView, setSelectedRequestForView] = useState(null)

  const [replyFormData, setReplyFormData] = useState({
    machine_ready: 'true',
    unit_price: '',
    notes: ''
  })

  const fetchRequests = async () => {
    try {
      const res = await getModel('?pageSize=1000')
      setAllRequests(res.area_requests || [])
    } catch (error) {
      console.error("Error loading requests", error)
    }
  }

  const fetchQuotations = async () => {
    if (rolePath === 'advisor' || rolePath === 'admin') {
      try {
        const res = await getQuotations('?pageSize=100')
        setQuotations(res.quotations || [])
      } catch (e) {
        console.error("Error loading quotations", e)
      }
    }
  }

  React.useEffect(() => {
    fetchRequests()
    fetchQuotations()
  }, [rolePath])

  const handleCreateRequest = async () => {
    if (!formData.quotation_id || !formData.area || !formData.name || !formData.description) return
    try {
      await insertModel({ area_request: formData })
      setIsDialogOpen(false)
      setFormData({ quotation_id: '', area: '', name: '', description: '' })
      fetchRequests()
    } catch (e) {
      console.error(e)
    }
  }
  const handleReplySubmit = async () => {
    if (!selectedRequestForReply) return
    try {
      await updateModel(
        { 
          area_request: { 
            notes: replyFormData.notes,
            machine_ready: replyFormData.machine_ready === 'true',
            unit_price: replyFormData.unit_price ? parseFloat(replyFormData.unit_price) : undefined
          } 
        }, 
        `/api/v1/admin/area_requests/${selectedRequestForReply.id}/reply`
      )
      setIsReplyOpen(false)
      setSelectedRequestForReply(null)
      setReplyFormData({ machine_ready: 'true', unit_price: '', notes: '' })
      fetchRequests()
    } catch (e) {
      console.error(e)
    }
  }
  
  // Filter based on role or area
  const requests = allRequests.filter(req => {
    // req.area es el destino (toArea)
    const fromArea = req.creator_role === 'Advisor' ? 'Comercial' : 
                     req.creator_role === 'Admin' ? 'General' : 
                     req.creator_role === 'Manager' ? 'Jefatura' : 
                     req.creator_role === 'Technician' ? 'Técnico' :
                     req.creator_role === 'Warehouseman' ? 'Logística' : 'Comercial'

    let matchesTab = true;
    if (activeTab === 'received') matchesTab = (req.area === currentArea);
    else if (activeTab === 'sent') matchesTab = (fromArea === currentArea);
    else if (activeTab === 'all') matchesTab = true;

    let matchesAdminFilter = true;
    if ((role === 'Admin' || role === 'Manager') && adminFilter !== 'Todas') {
      matchesAdminFilter = (fromArea === adminFilter || req.area === adminFilter);
    }

    return matchesTab && matchesAdminFilter;
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
              {(rolePath === 'advisor' || rolePath === 'admin') && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quotation" className="text-right">
                    Cotización
                  </Label>
                  <Select value={formData.quotation_id} onValueChange={(v) => setFormData({...formData, quotation_id: v})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona una cotización" />
                    </SelectTrigger>
                    <SelectContent>
                      {quotations.map(q => (
                        <SelectItem key={q.id} value={q.id}>{q.code} - {q.client_name || q.customer}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="toArea" className="text-right">
                  Área Destino
                </Label>
                <Select value={formData.area} onValueChange={(v) => setFormData({...formData, area: v})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona el área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Operaciones">Operaciones</SelectItem>
                    <SelectItem value="Logística">Logística</SelectItem>
                    <SelectItem value="Técnico">Técnico</SelectItem>
                    <SelectItem value="General">General (Admin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reqType" className="text-right">
                  Tipo
                </Label>
                <Select value={formData.name} onValueChange={(v) => setFormData({...formData, name: v})}>
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
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe exactamente qué necesitas..."
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRequest}>Enviar Solicitud</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white">Responder Solicitud de Área</DialogTitle>
              <DialogDescription>
                Completa los datos técnicos, define el costo final de la cotización y determina la disponibilidad de la máquina.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-black dark:text-white">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="machineReady" className="text-right text-xs">
                  Máquina Lista
                </Label>
                <Select value={replyFormData.machine_ready} onValueChange={(v) => setReplyFormData({...replyFormData, machine_ready: v})}>
                  <SelectTrigger className="col-span-3 text-black dark:text-white">
                    <SelectValue placeholder="Selecciona disponibilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sí, máquina lista/disponible</SelectItem>
                    <SelectItem value="false">No disponible actualmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unitPrice" className="text-right text-xs">
                  Precio (S/)
                </Label>
                <Input
                  id="unitPrice"
                  type="number"
                  placeholder="Ej: 1500"
                  value={replyFormData.unit_price}
                  onChange={(e) => setReplyFormData({...replyFormData, unit_price: e.target.value})}
                  className="col-span-3 text-black dark:text-white bg-white"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="replyNotes" className="text-right pt-2 text-xs">
                  Observaciones
                </Label>
                <Textarea
                  id="replyNotes"
                  value={replyFormData.notes}
                  onChange={(e) => setReplyFormData({...replyFormData, notes: e.target.value})}
                  placeholder="Detalles del estado de la máquina, observaciones técnicas..."
                  className="col-span-3 text-black dark:text-white bg-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleReplySubmit} className="bg-green-600 hover:bg-green-700 text-white">
                Enviar Respuesta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white">Detalle de Solicitud de Área</DialogTitle>
              <DialogDescription>
                Información de la solicitud enviada y sus resultados.
              </DialogDescription>
            </DialogHeader>
            {selectedRequestForView && (
              <div className="flex flex-col gap-4 py-4 text-black dark:text-white">
                <div className="grid grid-cols-2 gap-2 text-sm border p-3 rounded-md bg-muted/20">
                  <div><span className="font-semibold">ID:</span> {selectedRequestForView.id.substring(0,8)}</div>
                  <div><span className="font-semibold">Cotización:</span> {selectedRequestForView.quotation_code || '-'}</div>
                  <div className="col-span-2"><span className="font-semibold">Tipo:</span> {selectedRequestForView.name}</div>
                  <div><span className="font-semibold">De:</span> {selectedRequestForView.creator_email || 'Asesor'}</div>
                  <div><span className="font-semibold">Para Área:</span> {selectedRequestForView.area}</div>
                  <div><span className="font-semibold">Fecha:</span> {selectedRequestForView.created_at}</div>
                  <div>
                    <span className="font-semibold">Estado:</span>{' '}
                    <Badge variant={selectedRequestForView.status === 'completed' ? 'success' : selectedRequestForView.status === 'in_progress' ? 'warning' : 'outline'}>
                      {selectedRequestForView.status === 'completed' ? 'Completado' : selectedRequestForView.status === 'pending' ? 'Pendiente' : selectedRequestForView.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 border p-3 rounded-md bg-muted/20">
                  <span className="font-semibold text-sm">Detalle / Notas de Solicitud:</span>
                  <p className="text-sm whitespace-pre-line text-muted-foreground">{selectedRequestForView.description || 'Sin descripción'}</p>
                </div>

                {selectedRequestForView.status === 'completed' && (
                  <div className="flex flex-col gap-2 border p-3 rounded-md bg-green-50/50 border-green-200">
                    <span className="font-semibold text-sm text-green-800">Respuesta del Área:</span>
                    <div className="grid grid-cols-2 gap-2 text-sm text-green-900">
                      <div><span className="font-semibold">Máquina Lista:</span> {selectedRequestForView.machine_ready ? 'Sí' : 'No'}</div>
                      <div><span className="font-semibold">Precio Sugerido:</span> S/ {selectedRequestForView.unit_price || '-'}</div>
                    </div>
                    <div className="text-sm mt-2 text-green-900">
                      <span className="font-semibold">Notas:</span>
                      <p className="whitespace-pre-line mt-1">{selectedRequestForView.notes || 'Sin notas adicionales'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewOpen(false)} variant="outline">
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-[400px]">
          <TabsList className={`grid w-full ${(role === 'Admin' || role === 'Manager') ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="received">Recibidas</TabsTrigger>
            <TabsTrigger value="sent">Enviadas</TabsTrigger>
            {(role === 'Admin' || role === 'Manager') && (
              <TabsTrigger value="all">Global</TabsTrigger>
            )}
          </TabsList>
        </Tabs>
        
        { (role === 'Admin' || role === 'Manager') && (
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
                <SelectItem value="General">General</SelectItem>
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
                  <TableCell className="font-medium">{req.id.substring(0,8)}...</TableCell>
                  <TableCell>{req.creator_email || 'Asesor'}</TableCell>
                  <TableCell>{req.area}</TableCell>
                  <TableCell>{req.name}</TableCell>
                  <TableCell>{req.created_at}</TableCell>
                  <TableCell>
                    <Badge variant={req.status === 'completed' ? 'success' : req.status === 'in_progress' ? 'warning' : 'outline'}>
                      {req.status === 'completed' ? 'Completado' : req.status === 'pending' ? 'Pendiente' : req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedRequestForView(req); setIsViewOpen(true); }}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                       {(rolePath === 'admin' || rolePath === 'manager') && req.status !== 'completed' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-green-600 hover:text-green-700 hover:bg-green-100"
                          onClick={() => {
                            setSelectedRequestForReply(req)
                            setIsReplyOpen(true)
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </Button>
                      )}
                    </div>
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
