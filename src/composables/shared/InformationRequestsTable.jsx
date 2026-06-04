import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, MessageCircle, FileText, X } from 'lucide-react'
import useCrud from '@/hooks/useCrud'
import { useAuth } from '@/providers/UserContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function InformationRequestsTable({ role }) {
  const { user } = useAuth()
  const rolePath = role?.toLowerCase() === 'admin' ? 'admin' : 'advisor'
  const { getModel, updateModel } = useCrud(`/api/v1/${rolePath}/information_requests`)
  
  const [requests, setRequests] = useState([])
  const [selectedReq, setSelectedReq] = useState(null)
  const [responseMsg, setResponseMsg] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchRequests = async () => {
    try {
      const data = await getModel()
      setRequests(data.information_requests || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved': return <Badge className="bg-green-500">Resuelta</Badge>
      case 'pending': return <Badge className="bg-yellow-500">Pendiente</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleOpenModal = (req) => {
    setSelectedReq(req)
    setResponseMsg(req.response || '')
    setAttachment(null)
    setPreviewUrl(req.document_url || null)
    setIsModalOpen(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAttachment(file)
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file))
      } else if (file.type === 'application/pdf') {
        setPreviewUrl('pdf')
      } else {
        setPreviewUrl(null)
      }
    } else {
      setAttachment(null)
      setPreviewUrl(null)
    }
  }

  const handleContactWhatsApp = () => {
    if (!selectedReq?.client_phone) {
      toast.error('El cliente no proporcionó un número de teléfono válido.')
      return
    }
    
    // Limpiar el número de teléfono
    const phone = selectedReq.client_phone.replace(/\D/g, '')
    const responseText = responseMsg ? `\n\nTu respuesta es la siguiente:\n${responseMsg}` : '\n\nEn breve te enviaremos más detalles, o por favor envíanos tus datos.'
    const message = `Hola ${selectedReq.client_name}, bienvenido a CAT ERP. Recibimos tu duda sobre: "${selectedReq.subject}".${responseText}`
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${phone}?text=${encodedMessage}`
    
    window.open(url, '_blank')
  }

  const handleSaveResponse = async () => {
    if (!responseMsg.trim()) {
      toast.error('Debe ingresar una respuesta.')
      return
    }

    try {
      // El endpoint en el backend es PUT /api/v1/admin/information_requests/:id/respond
      // Nuestro hook useCrud updateModel usa PUT endpoint/:id
      // Pero no tenemos la ruta en useCrud para /respond. Así que hacemos un fetch directo o pasamos una ruta manual al backend_host.
      // Ya que useCrud tiene updateModel, podemos simplemente usar axios nativo si importamos axios, o hacerlo mediante fetch:
      
      const formData = new FormData()
      formData.append('response', responseMsg)
      formData.append('advisor_id', user.id)
      if (attachment) {
        formData.append('document', attachment)
      }
      
      const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST}/api/v1/${rolePath}/information_requests/${selectedReq.id}/respond`, {
        method: 'PUT',
        body: formData
      })

      if (res.ok) {
        toast.success('Respuesta guardada y solicitud resuelta.')
        setIsModalOpen(false)
        fetchRequests()
      } else {
        toast.error('Error al guardar la respuesta.')
      }
    } catch (e) {
      console.error(e)
      toast.error('Error de conexión.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">Solicitudes de Ayuda / Info</h2>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente / Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Asunto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.created_at}</TableCell>
                <TableCell className="font-medium">{req.client_name}</TableCell>
                <TableCell>{req.client_phone}</TableCell>
                <TableCell className="max-w-[200px] truncate">{req.subject}</TableCell>
                <TableCell>{getStatusBadge(req.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleOpenModal(req)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No hay solicitudes de información.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalle de la Solicitud</DialogTitle>
          </DialogHeader>
          {selectedReq && (
            <div className="grid gap-4 py-4">
              <div>
                <span className="font-bold">Cliente: </span>{selectedReq.client_name}
              </div>
              <div>
                <span className="font-bold">Teléfono: </span>{selectedReq.client_phone}
              </div>
              <div>
                <span className="font-bold">Asunto: </span>{selectedReq.subject}
              </div>
              <div className="p-3 bg-muted border rounded-md text-sm text-foreground">
                {selectedReq.message}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-bold mb-2">Respuesta / Registro Interno</label>
                <Textarea 
                  rows={4}
                  value={responseMsg} 
                  onChange={(e) => setResponseMsg(e.target.value)} 
                  placeholder="Escribe la respuesta o las notas de lo que se habló con el cliente..."
                  readOnly={selectedReq.status === 'resolved'}
                />
              </div>

              <div className="mt-2">
                <label className="block text-sm font-bold mb-2">Adjuntar Archivo (PDF o Imagen)</label>
                {selectedReq.status !== 'resolved' ? (
                  <input 
                    type="file" 
                    accept=".pdf,image/*" 
                    onChange={handleFileChange}
                    className="w-full text-sm border rounded p-1"
                  />
                ) : null}

                {previewUrl && (
                  <div className="mt-2 relative inline-block">
                    {previewUrl === 'pdf' || (selectedReq.document_url && selectedReq.document_url.endsWith('.pdf')) ? (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded border text-foreground">
                        <FileText className="text-red-500" />
                        <span className="text-sm font-semibold">Documento PDF Adjunto</span>
                        {selectedReq.document_url && (
                          <a href={selectedReq.document_url.startsWith('http') ? selectedReq.document_url : `${import.meta.env.VITE_BACKEND_HOST}${selectedReq.document_url}`} target="_blank" rel="noreferrer" className="text-blue-500 text-xs ml-2 hover:underline">Ver / Descargar</a>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded border" />
                        {selectedReq.document_url && (
                          <a href={selectedReq.document_url.startsWith('http') ? selectedReq.document_url : `${import.meta.env.VITE_BACKEND_HOST}${selectedReq.document_url}`} target="_blank" rel="noreferrer" className="block text-blue-500 text-xs mt-1 hover:underline">Ver Imagen Completa</a>
                        )}
                      </div>
                    )}
                    {attachment && (
                      <button 
                        type="button" 
                        onClick={() => { setAttachment(null); setPreviewUrl(null); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {selectedReq.status === 'resolved' && selectedReq.advisor_name && (
                <div className="text-xs text-gray-500 text-right">
                  Resuelto por: {selectedReq.advisor_name}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between items-center w-full">
            <Button type="button" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={handleContactWhatsApp}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Contactar por WhatsApp
            </Button>
            
            {selectedReq?.status !== 'resolved' && (
              <Button type="button" onClick={handleSaveResponse}>
                Marcar como Resuelta
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
