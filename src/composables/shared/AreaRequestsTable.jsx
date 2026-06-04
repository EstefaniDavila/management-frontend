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
    rental_rate_type: 'Día',
    estimated_days: '',
    start_date: '',
    pickup_details: '',
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
      await insertModel({ 
        area_request: formData, 
        user_id: user?.id, 
        advisor_id: user?.roleable_type === 'Advisor' ? user?.roleable_id : undefined 
      })
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
          user_id: user?.id,
          area_request: { 
            notes: replyFormData.notes,
            machine_ready: replyFormData.machine_ready === 'true',
            unit_price: replyFormData.unit_price ? parseFloat(replyFormData.unit_price) : undefined,
            rental_rate_type: replyFormData.rental_rate_type,
            estimated_days: replyFormData.estimated_days,
            start_date: replyFormData.start_date,
            pickup_details: replyFormData.pickup_details
          } 
        }, 
        `/api/v1/admin/area_requests/${selectedRequestForReply.id}/reply`
      )
      setIsReplyOpen(false)
      setSelectedRequestForReply(null)
      setReplyFormData({ machine_ready: 'true', unit_price: '', rental_rate_type: 'Día', estimated_days: '', start_date: '', pickup_details: '', notes: '' })
      fetchRequests()
    } catch (e) {
      console.error(e)
    }
  }
  
  // Filter based on role or area
  const requests = allRequests.filter(req => {
    let fromArea = 'Comercial';
    if (req.creator_role) {
      fromArea = req.creator_role === 'Advisor' ? 'Comercial' : 
                 req.creator_role === 'Admin' ? 'General' : 
                 req.creator_role === 'Manager' ? 'Operaciones' : 
                 req.creator_role === 'Technician' ? 'Técnico' :
                 (req.creator_role === 'Warehouseman' || req.creator_role === 'LogisticsUser') ? 'Logística' : 'Comercial'
    } else if (req.creator_email && user?.email && req.creator_email === user.email) {
      // Fallback si producción no envía creator_role:
      // Si el correo del creador coincide con el usuario actual, el fromArea es su propia área.
      fromArea = currentArea;
    }

    let effectiveArea = currentArea;
    if ((role === 'Admin' || role === 'Manager') && adminFilter !== 'Todas') {
      effectiveArea = adminFilter;
    }

    let matchesTab = true;
    if (activeTab === 'received') {
      // Si está completada, el que la "recibe" ahora es quien la originó (fromArea).
      // Si está pendiente, el que la "recibe" es el área destino (req.area).
      if (req.status === 'completed') {
        matchesTab = (fromArea === effectiveArea);
      } else {
        matchesTab = (req.area === effectiveArea);
      }
    } else if (activeTab === 'sent') {
      // Si está completada, el que la "envió" es quien la respondió (req.area).
      // Si está pendiente, el que la "envió" es quien la originó (fromArea).
      if (req.status === 'completed') {
        matchesTab = (req.area === effectiveArea);
      } else {
        matchesTab = (fromArea === effectiveArea);
      }
    } else if (activeTab === 'all') {
      matchesTab = true;
    }

    let matchesAdminFilter = true;
    // Solo aplicamos este filtro extra en la pestaña Global
    if ((role === 'Admin' || role === 'Manager') && adminFilter !== 'Todas' && activeTab === 'all') {
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
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Solicitud</DialogTitle>
              <DialogDescription>
                Genera una petición para que otra área te apoye con requerimientos técnicos o de llenado de datos.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              {(rolePath === 'advisor' || rolePath === 'admin') && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="quotation">
                    Cotización
                  </Label>
                  <Select value={formData.quotation_id} onValueChange={(v) => setFormData({...formData, quotation_id: v})}>
                    <SelectTrigger>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="toArea">
                    Área Destino
                  </Label>
                  <Select value={formData.area} onValueChange={(v) => setFormData({...formData, area: v})}>
                    <SelectTrigger>
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
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reqType">
                    Tipo
                  </Label>
                  <Select value={formData.name} onValueChange={(v) => setFormData({...formData, name: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de solicitud" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completar Cotización">Completar Cotización</SelectItem>
                      <SelectItem value="Revisión Técnica">Revisión Técnica</SelectItem>
                      <SelectItem value="Actualización Datos">Actualización Datos</SelectItem>
                      <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="detail">
                  Detalle
                </Label>
                <Textarea
                  id="detail"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe exactamente qué necesitas..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRequest}>Enviar Solicitud</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
          <DialogContent className="sm:max-w-[900px] w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white text-xl">Responder Solicitud de Área</DialogTitle>
              <DialogDescription>
                Completa los datos técnicos, tiempos, costos y requerimientos logísticos de esta cotización.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 text-black dark:text-white">
              {/* Columna Izquierda: Detalles de la Solicitud */}
              <div className="flex flex-col gap-4 md:border-r md:pr-6">
                <h3 className="font-semibold text-lg border-b pb-2">Información de la Solicitud</h3>
                {selectedRequestForReply && (
                  <div className="flex flex-col gap-3 mt-2 mb-2 p-4 text-sm text-muted-foreground border rounded-md bg-muted/10 shadow-sm">
                    <p><strong className="text-black dark:text-white">Origen:</strong> {selectedRequestForReply.creator_email}</p>
                    <p><strong className="text-black dark:text-white">Cotización:</strong> {selectedRequestForReply.quotation_code}</p>
                    <p><strong className="text-black dark:text-white">Tipo de Solicitud:</strong> {selectedRequestForReply.name}</p>
                    <p><strong className="text-black dark:text-white">Detalle / Notas:</strong> {selectedRequestForReply.description || 'Sin detalle'}</p>
                    <div className="mt-2">
                      <strong className="text-black dark:text-white">Equipos a Revisar:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {selectedRequestForReply.quotation_items && selectedRequestForReply.quotation_items.length > 0 ? (
                          selectedRequestForReply.quotation_items.map((item, i) => (
                            <li key={i} className="text-black dark:text-white font-medium bg-muted/30 px-2 py-1 rounded">{item.quantity}x {item.description}</li>
                          ))
                        ) : (
                          <li>No hay equipos</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Lógica para saber si es una solicitud post-orden (solo confirmación) o pre-cotización (requiere formulario) */}
              {(() => {
                const isPostOrder = selectedRequestForReply?.name?.match(/Despacho|Preparar|Ejecutar/i) || selectedRequestForReply?.name?.includes('[');
                
                if (isPostOrder) {
                  return (
                    <div className="flex flex-col gap-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Confirmación de Recepción</h3>
                      <div className="flex flex-col gap-4 p-4 border rounded-md bg-blue-50/50">
                        <p className="text-sm text-blue-800">
                          Tu área ha recibido esta solicitud. Al aprobarla o confirmarla, notificarás al equipo de origen que ya están trabajando en las órdenes correspondientes a esta solicitud.
                        </p>
                        <p className="text-sm text-blue-800 italic">
                          No necesitas ingresar detalles aquí. Podrás manejar la gestión operativa directamente desde el módulo de tu área.
                        </p>
                      </div>
                    </div>
                  );
                }

                // Formulario detallado original
                return (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Tu Respuesta Técnica</h3>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="machineReady" className="text-xs">
                        Disponibilidad de Máquina / Factibilidad
                      </Label>
                      <Select value={replyFormData.machine_ready} onValueChange={(v) => setReplyFormData({...replyFormData, machine_ready: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona disponibilidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Sí, máquina lista/disponible</SelectItem>
                          <SelectItem value="false">No disponible o En Reparación</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(() => {
                      const isMaintenance = selectedRequestForReply?.name?.toLowerCase().includes('mantenimiento') || selectedRequestForReply?.name?.toLowerCase().includes('revisión');
                      if (isMaintenance) {
                        return (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="unitPrice" className="text-xs">
                                  Costo de Mantenimiento / Revisión (S/)
                                </Label>
                                <Input
                                  id="unitPrice"
                                  type="number"
                                  placeholder="Ej: 500"
                                  value={replyFormData.unit_price}
                                  onChange={(e) => setReplyFormData({...replyFormData, unit_price: e.target.value})}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="estimatedDays" className="text-xs">
                                  Duración del Mantenimiento
                                </Label>
                                <Input
                                  id="estimatedDays"
                                  type="text"
                                  placeholder="Ej: 2 días, 4 horas..."
                                  value={replyFormData.estimated_days}
                                  onChange={(e) => setReplyFormData({...replyFormData, estimated_days: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="startDate" className="text-xs">
                                Fecha Sugerida para Mantenimiento
                              </Label>
                              <Input
                                id="startDate"
                                type="date"
                                value={replyFormData.start_date}
                                onChange={(e) => setReplyFormData({...replyFormData, start_date: e.target.value})}
                              />
                            </div>
                          </>
                        );
                      }
                      
                      // Campos para Alquiler
                      return (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label className="text-xs">
                                Tipo de Tarifa (Alquiler)
                              </Label>
                              <Select value={replyFormData.rental_rate_type} onValueChange={(v) => setReplyFormData({...replyFormData, rental_rate_type: v})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Tipo de cobro" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Hora">Por Hora</SelectItem>
                                  <SelectItem value="Día">Por Día</SelectItem>
                                  <SelectItem value="Semana">Por Semana</SelectItem>
                                  <SelectItem value="Mes">Por Mes</SelectItem>
                                  <SelectItem value="Global">Tarifa Global / Fija</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="unitPrice" className="text-xs">
                                Precio Sugerido por {replyFormData.rental_rate_type} (S/)
                              </Label>
                              <Input
                                id="unitPrice"
                                type="number"
                                placeholder="Ej: 1500"
                                value={replyFormData.unit_price}
                                onChange={(e) => setReplyFormData({...replyFormData, unit_price: e.target.value})}
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="estimatedDays" className="text-xs">
                              Periodo Estimado / Duración
                            </Label>
                            <Input
                              id="estimatedDays"
                              type="text"
                              placeholder="Ej: 5 días, 2 semanas..."
                              value={replyFormData.estimated_days}
                              onChange={(e) => setReplyFormData({...replyFormData, estimated_days: e.target.value})}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="startDate" className="text-xs">
                              Fecha de Inicio Sugerida
                            </Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={replyFormData.start_date}
                              onChange={(e) => setReplyFormData({...replyFormData, start_date: e.target.value})}
                            />
                          </div>
                        </>
                      );
                    })()}

                    <div className="grid gap-2">
                      <Label htmlFor="pickupDetails" className="text-xs">
                        Detalles de Recojo / Despacho / Logística
                      </Label>
                      <Textarea
                        id="pickupDetails"
                        value={replyFormData.pickup_details}
                        onChange={(e) => setReplyFormData({...replyFormData, pickup_details: e.target.value})}
                        placeholder="Incluir costos de traslado, dirección, requerimientos de cama baja, etc."
                        className="min-h-[60px]"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="replyNotes" className="text-xs">
                        Observaciones Adicionales
                      </Label>
                      <Textarea
                        id="replyNotes"
                        value={replyFormData.notes}
                        onChange={(e) => setReplyFormData({...replyFormData, notes: e.target.value})}
                        placeholder="Detalles del estado de la máquina, recomendaciones..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
            <DialogFooter>
              {(() => {
                const isPostOrder = selectedRequestForReply?.name?.match(/Despacho|Preparar|Ejecutar/i) || selectedRequestForReply?.name?.includes('[');
                if (isPostOrder) {
                  return (
                    <Button onClick={() => {
                      setReplyFormData({ ...replyFormData, machine_ready: 'true', notes: 'Solicitud aprobada y en proceso en el área.' })
                      handleReplySubmit()
                    }} className="bg-green-600 hover:bg-green-700 text-white">
                      Marcar como Enterado / Aprobar
                    </Button>
                  );
                }
                return (
                  <Button onClick={handleReplySubmit} className="bg-green-600 hover:bg-green-700 text-white">
                    Enviar Respuesta
                  </Button>
                );
              })()}
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
                  <span className="font-semibold text-sm">Equipos de la Cotización:</span>
                  <ul className="text-sm list-disc list-inside text-muted-foreground">
                    {selectedRequestForView.quotation_items && selectedRequestForView.quotation_items.length > 0 ? (
                      selectedRequestForView.quotation_items.map((item, i) => (
                        <li key={i}>{item.quantity}x {item.description}</li>
                      ))
                    ) : (
                      <li>No hay equipos</li>
                    )}
                  </ul>
                </div>
                
                <div className="flex flex-col gap-1 border p-3 rounded-md bg-muted/20">
                  <span className="font-semibold text-sm">Detalle / Notas de Solicitud:</span>
                  <p className="text-sm whitespace-pre-line text-muted-foreground">{selectedRequestForView.description || 'Sin descripción'}</p>
                </div>

                {selectedRequestForView.status === 'completed' && (
                  (() => {
                    const isPostOrder = selectedRequestForView?.name?.match(/Despacho|Preparar|Ejecutar/i) || selectedRequestForView?.name?.includes('[');
                    
                    if (isPostOrder) {
                      return (
                        <div className="flex flex-col gap-2 border p-3 rounded-md bg-green-50/50 border-green-200">
                          <span className="font-semibold text-sm text-green-800">Confirmación del Área:</span>
                          <p className="text-sm text-green-900 mt-1">
                            El área destino fue notificada y ha marcado esta solicitud como en proceso / aprobada. Las órdenes respectivas ya están siendo gestionadas en su módulo interno.
                          </p>
                        </div>
                      );
                    }

                    return (
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
                    );
                  })()
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
