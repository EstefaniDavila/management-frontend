import React, {useState} from 'react'
import Modal from '@/components/custom/modal'
import { ScrollArea } from "@/components/ui/scroll-area"


const ModalShowAction = ({ isOpen, handleClose, workOrder }) =>{

  const actions = workOrder?.work_order_actions || []
  const sortedActions = [...actions].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )

  return (
    <div>
      {isOpen && (
        <Modal
          open={isOpen}
          setOpen={handleClose}
          title="Ver Acciónes de la Orden de Trabajo"
          description="Información de la acciones realizadas en la orden de trabajo seleccionada."
          size="lg"
        >
          <div className="overflow-y-auto">

            {/* HEADER */}
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 border-b pb-2 mb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-6">Acción / Descripción</div>
              <div className="col-span-5">Evidencia</div>
            </div>

            {/* BODY */}
            <ScrollArea className="h-[400px] pr-3">
              <div className="space-y-2">

                {sortedActions.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-4">
                    No hay acciones registradas
                  </p>
                )}

                {sortedActions.map((action, index) => (
                  <div
                    key={action.id}
                    className="grid grid-cols-12 gap-2 items-center border rounded-md p-2 hover:border-gray-50"
                  >

                    {/* NUMERO */}
                    <div className="col-span-1 flex items-center justify-center">
                      <span className="w-6 h-6 flex items-center justify-center bg-green-500 text-white text-xs rounded-full">
                        {index + 1}
                      </span>
                    </div>

                    {/* ACCION + DESCRIPCION */}
                    <div className="col-span-6">
                      <p className="font-semibold text-sm">{action.action}</p>
                      <p className="text-xs">
                        {action.description}
                      </p>
                    </div>

                    {/* IMAGEN */}
                    <div className="col-span-5">
                      {action.evidence ? (
                        <img
                          src={action.evidence}
                          alt="evidencia"
                          className="object-cover rounded-md border"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">
                          Sin evidencia
                        </span>
                      )}
                    </div>

                  </div>
                ))}

              </div>
            </ScrollArea>

          </div>
        </Modal>
      )}
    </div>
  )
}

export default ModalShowAction