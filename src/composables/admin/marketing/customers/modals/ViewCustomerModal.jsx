import React from 'react'
import Modal from '@/components/custom/modal'
import { Badge } from '@/components/ui/badge'

const typeLabels = {
  construccion: 'Construcción',
  mineria: 'Minería',
  transporte: 'Transporte',
  energia: 'Energía',
}

const ViewCustomerModal = ({ isOpen, handleClose, customer }) => {
  if (!customer) return null

  const fields = [
    { label: 'Código',        value: customer.code },
    { label: 'Razón Social',  value: customer.business_name },
    { label: 'Tipo Doc.',     value: customer.document_type },
    { label: 'N° Documento',  value: customer.document_number },
    { label: 'Contacto',      value: customer.contact_name },
    { label: 'Teléfono',      value: customer.phone },
    { label: 'Correo',        value: customer.email },
    { label: 'Rubro',         value: typeLabels[customer.type] || customer.type },
    { label: 'Dirección',     value: customer.address },
  ]

  return (
    isOpen && (
      <Modal
        open={isOpen}
        setOpen={handleClose}
        title="Detalle del Cliente"
        description={`Información de ${customer.business_name}`}
        size="md"
        callBack={handleClose}
      >
        <div className="grid grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.label} className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{f.label}</span>
              <span className="text-sm font-medium">{f.value || '—'}</span>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Estado</span>
            <Badge className={`w-fit px-2 py-1 ${customer.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
              {customer.status === 'active' ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </Modal>
    )
  )
}

export default ViewCustomerModal