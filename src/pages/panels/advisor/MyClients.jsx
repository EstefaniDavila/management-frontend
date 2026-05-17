import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/custom/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import useCrud from '@/hooks/useCrud'
import useEntityMutation from '@/hooks/useEntityMutation'
import { useAuth } from '@/providers/UserContext'

const PRIORITY_COLORS = {
  CN: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50',
  CP: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50',
  CR: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
}

const PRIORITY_LABELS = {
  CN: 'CN - No Deseado',
  CP: 'CP - Potencial',
  CR: 'CR - Reciclado',
}

const MyClients = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getModel: getLeads } = useCrud('/api/v1/advisor/leads')
  const { getModel: getQuotations } = useCrud('/api/v1/advisor/quotations')
  const { insertModel: sendCredentials } = useCrud()
  const leadMutation = useEntityMutation({ entityName: 'lead' })

  const [leads, setLeads] = useState([])
  const [quotations, setQuotations] = useState([])
  const [trackingModalOpen, setTrackingModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [newNote, setNewNote] = useState('')

  const fetchLeadsAndQuotations = async () => {
    try {
      const params = new URLSearchParams()
      params.append('pageSize', '1000') // fetch all for now
      if (user?.roleable?.id) {
        params.append('advisor_id', user.roleable.id)
      }

      const [leadsRes, quotesRes] = await Promise.all([
        getLeads(`?${params.toString()}`),
        getQuotations(`?${params.toString()}`)
      ])

      const leadsArray = leadsRes.leads || []
      const quotesArray = quotesRes.quotations || []

      const formattedLeads = leadsArray.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        company: item.client_name ? `${item.client_name} (${item.client_code || '-'})` : item.source || 'Sin empresa',
        request_type: item.type || 'machinery_sale',
        description: item.notes,
        status: item.status,
        priority: item.priority || 'CP',
        tracking: item.tracking || [], // Si el backend no tiene tracking, será []
        assigned_to: item.assigned_to_id ? user?.name : null,
        client_id: item.client_id,
        created_at: item.created_at,
        _original: item
      }))

      setLeads(formattedLeads)
      setQuotations(quotesArray)
    } catch (error) {
      console.error("Error al cargar datos:", error)
    }
  }

  useEffect(() => {
    fetchLeadsAndQuotations()
  }, [])

  // Clientes = leads convertidos
  const myClients = leads.filter(l => l.status === 'converted')

  const getQuotationsForLead = (leadId) =>
    quotations.filter(q => q.lead_id === leadId)

  const handlePriorityChange = (clientId, newPriority) => {
    leadMutation.mutate({
      action: 'update',
      id: clientId,
      entity: { lead: { priority: newPriority } },
      endpoint: `/api/v1/advisor/leads/${clientId}`
    }, {
      onSuccess: () => fetchLeadsAndQuotations()
    })
  }

  const handleSaveTracking = () => {
    if (!selectedClient || !newNote.trim()) return
    // Asumimos que notes en el backend guardará esto, o podrías tener una tabla de tracking. 
    // Por ahora lo guardaremos en notes agregando a lo que ya hay.
    const currentNotes = selectedClient._original?.notes || ''
    const updatedNotes = `${currentNotes}\n[${new Date().toLocaleDateString()}] ${newNote}`.trim()

    leadMutation.mutate({
      action: 'update',
      id: selectedClient.id,
      entity: { lead: { notes: updatedNotes } },
      endpoint: `/api/v1/advisor/leads/${selectedClient.id}`
    }, {
      onSuccess: () => {
        fetchLeadsAndQuotations()
        setNewNote('')
        setTrackingModalOpen(false)
        setSelectedClient(null)
      }
    })
  }

  const handleSendCredentials = async (clientId) => {
    if (!clientId) {
      alert("Este lead no tiene un cliente asociado en la base de datos.");
      return;
    }
    try {
      const res = await sendCredentials({}, `/api/v1/advisor/clients/${clientId}/send_credentials`);
      // Mostramos la contraseña temporal para propósitos de demostración/desarrollo
      alert(`${res.message}\nContraseña Temporal: ${res.temporary_password}`);
    } catch (error) {
      console.error("Error al enviar credenciales", error);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-base font-semibold">Mis Clientes y Prioridades</h1>
        <p className="text-xs text-muted-foreground">Gestiona la clasificación y seguimiento de tus clientes activos</p>
      </div>

      <div className="flex flex-col gap-4">
        {myClients.length === 0 && (
          <div className="border rounded-xl bg-card p-8 text-center text-sm text-muted-foreground">
            Aún no tienes clientes convertidos.
          </div>
        )}
        {myClients.map(client => {
          const clientQuotations = getQuotationsForLead(client.id)
          return (
            <div key={client.id} className="border rounded-xl bg-card shadow-sm p-4 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <p className="text-base font-semibold">{client.company}</p>
                  <p className="text-sm text-muted-foreground">{client.name} · {client.email}</p>
                </div>
                
                <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mt-2 md:mt-0">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 font-medium">Prioridad Actual</span>
                    <Select value={client.priority || 'CP'} onValueChange={(val) => handlePriorityChange(client.id, val)}>
                      <SelectTrigger className={`w-[160px] h-9 text-xs font-semibold border shadow-sm transition-all ${PRIORITY_COLORS[client.priority || 'CP']}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CN" className="text-red-600 focus:text-red-700 dark:text-red-400">CN - No Deseado</SelectItem>
                        <SelectItem value="CP" className="text-amber-600 focus:text-amber-700 dark:text-amber-400">CP - Potencial</SelectItem>
                        <SelectItem value="CR" className="text-blue-600 focus:text-blue-700 dark:text-blue-400">CR - Reciclado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 font-medium">Seguimiento</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 text-xs shadow-sm hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedClient(client)
                        setTrackingModalOpen(true)
                      }}
                    >
                      Ver / Añadir Notas
                    </Button>
                  </div>
                  
                  {/* Botón de Enviar Credenciales */}
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 font-medium">Portal Web</span>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="h-9 text-xs shadow-sm bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleSendCredentials(client.client_id)}
                    >
                      Enviar Credenciales
                    </Button>
                  </div>

                  {/* Botón de Ver Cotizaciones Pendientes */}
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 font-medium">Cotizaciones</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 text-xs shadow-sm border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50/80 font-medium"
                      onClick={() => navigate(`/advisor/quotations?search=${encodeURIComponent(client.company || client.name)}`)}
                    >
                      Ver Cotizaciones Pendientes
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cotizaciones Asociadas */}
              {clientQuotations.length > 0 && (
                <div className="flex flex-col gap-2 bg-muted/20 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Últimas Cotizaciones</p>
                  {clientQuotations.map(q => (
                    <div key={q.id} className="flex items-center justify-between text-xs border bg-background rounded-lg px-3 py-2">
                      <span className="font-mono font-medium">{q.id}</span>
                      <span className="text-muted-foreground truncate max-w-[150px]">{q.quotation_type}</span>
                      <span className="font-semibold">S/ {parseFloat(q.total || q.amount || 0).toLocaleString()}</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        q.status === 'approved' ? 'bg-green-100 text-green-800' :
                        q.status === 'sent'     ? 'bg-blue-100 text-blue-800' :
                        q.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                  'bg-gray-100 text-gray-700'
                      }`}>{q.status}</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 h-7 font-bold transition-all"
                        onClick={() => navigate(`/advisor/quotations?search=${encodeURIComponent(client.company || client.name)}&openQuotationId=${q.id}`)}
                      >
                        Revisar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Tabla Resumen de Clientes */}
      <div className="mt-6 border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/20">
          <h2 className="text-sm font-semibold">Resumen de Clientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Empresa</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Contacto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Correo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Prioridad</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide">Cotizaciones</th>
              </tr>
            </thead>
            <tbody>
              {myClients.map((client, i) => {
                const qCount = getQuotationsForLead(client.id).length
                return (
                  <tr key={client.id} className={`border-t hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="px-4 py-3 font-medium">{client.company}</td>
                    <td className="px-4 py-3">{client.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{client.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={PRIORITY_COLORS[client.priority || 'CP']}>
                        {PRIORITY_LABELS[client.priority || 'CP']}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center bg-secondary text-secondary-foreground rounded-full h-6 w-6 text-xs font-bold">
                        {qCount}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {myClients.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-muted-foreground">
                    No hay datos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Seguimiento */}
      <Dialog open={trackingModalOpen} onOpenChange={(open) => !open && setTrackingModalOpen(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Seguimiento del Cliente</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm">{selectedClient?.company}</span>
              <span className="text-xs text-muted-foreground">
                Prioridad actual: <Badge variant="outline" className={PRIORITY_COLORS[selectedClient?.priority] || ''}>{PRIORITY_LABELS[selectedClient?.priority]}</Badge>
              </span>
            </div>

            <div className="bg-muted/30 border rounded-lg p-3 max-h-[200px] overflow-y-auto flex flex-col gap-2">
              <div className="text-xs text-muted-foreground whitespace-pre-wrap">
                {selectedClient?._original?.notes || 'Sin notas de seguimiento registradas.'}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-semibold">Añadir nueva nota:</label>
              <Textarea 
                value={newNote} 
                onChange={(e) => setNewNote(e.target.value)} 
                placeholder="Ej. Se llamó al cliente para renovar equipo..."
                className="text-sm min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTrackingModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveTracking} disabled={!newNote.trim()}>Guardar Nota</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MyClients