import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/UserContext'
import useCrud from '@/hooks/useCrud'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, ExternalLink, CheckCircle2 } from 'lucide-react'

export default function AccessRequestsTable({ role }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    requested_role: '',
    first_name: '',
    last_name: '',
    document_type: 'DNI',
    document_number: '',
    email: '',
    phone: ''
  })

  const rolePath = role?.toLowerCase() === 'admin' ? 'admin' :
                   role?.toLowerCase() === 'manager' ? 'manager' : 'admin'

  const { getModel, insertModel, updateModel } = useCrud(`/api/v1/${rolePath}/access_requests`)

  const fetchRequests = async () => {
    try {
      // Pasamos el user_id para que el backend pueda filtrar si es un Manager
      const query = user?.id ? `?user_id=${user.id}` : ''
      const data = await getModel(query)
      setRequests(data.access_requests || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [rolePath])

  const handleCreateRequest = async () => {
    if (!formData.requested_role || !formData.first_name || !formData.last_name || !formData.document_number || !formData.email) return
    try {
      await insertModel({ access_request: formData, user_id: user?.id })
      setIsDialogOpen(false)
      setFormData({ requested_role: '', first_name: '', last_name: '', document_type: 'DNI', document_number: '', email: '', phone: '' })
      fetchRequests()
    } catch (e) {
      console.error(e)
    }
  }

  const handleGoToCreate = (req) => {
    // Redirige al administrador a la pantalla de usuarios enviando los datos precargados
    navigate('/users', { state: { prefilledData: req, fromAccessRequest: true } })
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <Badge className="bg-green-500 hover:bg-green-600">Completada</Badge>
      case 'rejected': return <Badge variant="destructive">Rechazada</Badge>
      default: return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-medium">Solicitudes de Accesos</CardTitle>
        {role === 'Manager' && (
          <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Solicitud
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-0">
        <div className="rounded-md border bg-white dark:bg-gray-950 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900">
              <TableRow>
                <TableHead>Fecha</TableHead>
                {role === 'Admin' && <TableHead>Solicitante</TableHead>}
                <TableHead>Rol Solicitado</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                {role === 'Admin' && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={role === 'Admin' ? 7 : 5} className="text-center h-24 text-muted-foreground">
                    No hay solicitudes de accesos registradas.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.created_at}</TableCell>
                    {role === 'Admin' && (
                      <TableCell>
                        <div className="font-medium">{req.creator_name || req.creator_email}</div>
                        <div className="text-xs text-muted-foreground">{req.creator_role}</div>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant="outline">{req.requested_role}</Badge>
                    </TableCell>
                    <TableCell>{req.first_name} {req.last_name}</TableCell>
                    <TableCell>{req.email}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    {role === 'Admin' && (
                      <TableCell className="text-right">
                        {req.status === 'pending' ? (
                          <Button size="sm" variant="outline" onClick={() => handleGoToCreate(req)} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                            <ExternalLink className="mr-2 h-3 w-3" />
                            Ir a Crear
                          </Button>
                        ) : (
                          <span className="text-sm text-green-600 flex items-center justify-end"><CheckCircle2 className="h-4 w-4 mr-1"/> Procesada</span>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Solicitar Creación de Acceso</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Nombres</Label>
                  <Input 
                    value={formData.first_name} 
                    onChange={(e) => {
                      const val = e.target.value
                      const first = val.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
                      const last = formData.last_name.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
                      const email = (first || last) ? `${first}${first && last ? '.' : ''}${last}@erpcat.com` : ''
                      setFormData({...formData, first_name: val, email})
                    }} 
                    placeholder="Ej. Juan" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Apellidos</Label>
                  <Input 
                    value={formData.last_name} 
                    onChange={(e) => {
                      const val = e.target.value
                      const first = formData.first_name.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
                      const last = val.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
                      const email = (first || last) ? `${first}${first && last ? '.' : ''}${last}@erpcat.com` : ''
                      setFormData({...formData, last_name: val, email})
                    }} 
                    placeholder="Ej. Pérez" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tipo Documento</Label>
                  <Select value={formData.document_type} onValueChange={(v) => setFormData({...formData, document_type: v})}>
                    <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                      <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>N° Documento</Label>
                  <Input value={formData.document_number} onChange={(e) => setFormData({...formData, document_number: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Correo Electrónico (Para Login)</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="usuario@empresa.com" />
              </div>
              <div className="grid gap-2">
                <Label>Teléfono</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Ej. 999888777" />
              </div>
              <div className="grid gap-2">
                <Label>Rol Solicitado</Label>
                <Select value={formData.requested_role} onValueChange={(v) => setFormData({...formData, requested_role: v})}>
                  <SelectTrigger><SelectValue placeholder="Seleccione el Rol" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Advisor">Asesor de Ventas / Comercial</SelectItem>
                    <SelectItem value="Technician">Técnico</SelectItem>
                    <SelectItem value="Warehouseman">Almacenero</SelectItem>
                    <SelectItem value="LogisticsUser">Logística</SelectItem>
                    <SelectItem value="Manager">Jefe de Área</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateRequest} disabled={!formData.first_name || !formData.requested_role || !formData.email}>
                Enviar Solicitud
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
