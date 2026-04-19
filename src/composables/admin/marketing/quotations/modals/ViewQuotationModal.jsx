import React from 'react'
import Modal from '@/components/custom/modal'
import { Badge } from '@/components/ui/badge'

const statusColor = {
  Pending:  'bg-yellow-200 text-yellow-800',
  Approved: 'bg-green-200 text-green-800',
  Rejected: 'bg-red-200 text-red-800',
}

const ViewQuotationModal = ({ isOpen, handleClose, quotation }) => {
  if (!quotation) return null

  const fields = [
    { label: 'Code',      value: quotation.code },
    { label: 'Customer',  value: quotation.customer },
    { label: 'Document',  value: quotation.document },
    { label: 'Equipment', value: quotation.equipment },
    { label: 'Advisor',   value: quotation.advisor },
    { label: 'Amount',    value: `S/ ${quotation.amount?.toLocaleString()}` },
    { label: 'Date',      value: quotation.date },
  ]

  return (
    isOpen && (
      <Modal
        open={isOpen}
        setOpen={handleClose}
        title="Quotation Detail"
        description={`Detail of quotation ${quotation.code}`}
        size="md"
        callBack={handleClose}
      >
        <div className="grid grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.label} className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{f.label}</span>
              <span className="text-sm font-medium">{f.value}</span>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Status</span>
            <Badge className={`w-fit px-2 py-1 ${statusColor[quotation.status]}`}>
              {quotation.status}
            </Badge>
          </div>
        </div>
      </Modal>
    )
  )
}

export default ViewQuotationModal