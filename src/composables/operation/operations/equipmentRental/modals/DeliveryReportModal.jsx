import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Send, FileText, CheckCircle2, Clock, MapPin, Truck } from "lucide-react"
import { toast } from 'sonner'

export default function DeliveryReportModal({ isOpen, onClose, rental }) {
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  if (!rental) return null

  const handleSendToCommercial = () => {
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setIsSent(true)
      toast.success("Informe enviado al Área Comercial", {
        description: `Se ha notificado sobre la entrega de la orden ${rental.id}`
      })
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if(!open) {
        setIsSent(false)
        onClose()
      }
    }}>
      <DialogContent className="sm:max-w-[600px] bg-slate-50 dark:bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-blue-600" />
            Acta de Entrega / Informe de Alquiler
          </DialogTitle>
        </DialogHeader>

        <div className="bg-white dark:bg-card border rounded-xl p-6 shadow-sm my-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight uppercase text-blue-900 dark:text-blue-100">
                {rental.id}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Documento Interno de Operaciones</p>
            </div>
            <Badge variant="outline" className={`${rental.status === 'Entregada' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'} px-3 py-1 text-sm border-transparent`}>
              {rental.status}
            </Badge>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Datos del Cliente</p>
                <p className="font-medium text-sm">{rental.customer}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                  <Truck className="h-3 w-3" /> Equipo Asignado
                </p>
                <p className="font-medium text-sm text-blue-700 dark:text-blue-400">{rental.equipment}</p>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Agendamiento de Entrega
                </p>
                <p className="font-medium text-sm">{rental.deliveryDate.replace('T', ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Lugar de Origen
                </p>
                <p className="font-medium text-sm">Almacén Principal Operaciones</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Comentarios Operativos</p>
            <div className="bg-muted p-3 rounded-md text-sm italic">
              {rental.notes || "Equipo verificado según checklist operativo estándar. Listo para despacho."}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={onClose}>
            Cerrar Vista
          </Button>
          
          <Button 
            onClick={handleSendToCommercial} 
            disabled={isSending || isSent}
            className={`gap-2 transition-all ${isSent ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSent ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Enviado a Comercial
              </>
            ) : isSending ? (
              "Generando y Enviando..."
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar Informe a Comercial
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
