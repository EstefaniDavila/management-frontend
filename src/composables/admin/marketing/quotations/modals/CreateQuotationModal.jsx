import React, { useState } from 'react'
import Modal from '@/components/custom/modal'
import { Input } from '@/components/ui/input'
import { handleChange } from '@/services/general/handlers'

const initialForm = {
  code: '', customer: '', document: '',
  equipment: '', advisor: '', amount: '', date: ''
}

const CreateQuotationModal = ({ isOpen, handleClose, onCreate }) => {
  const [formData, setFormData] = useState(initialForm)

  const onChangeExtra = () => {}

  const handleSubmit = () => {
    onCreate({ ...formData, status: 'Pending', id: Date.now() })
    setFormData(initialForm)
    handleClose()
  }

  return (
    isOpen && (
      <Modal
        open={isOpen}
        setOpen={handleClose}
        title="New Quotation"
        description="Fill in the fields to create a new quotation."
        size="md"
        callBack={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Quotation Code', name: 'code' },
            { label: 'Customer', name: 'customer' },
            { label: 'Document (RUC/DNI)', name: 'document' },
            { label: 'Equipment', name: 'equipment' },
            { label: 'Advisor', name: 'advisor' },
            { label: 'Amount (S/)', name: 'amount', type: 'number' },
          ].map(field => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-sm font-medium">{field.label}</label>
              <Input
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name]}
                onChange={e => handleChange(e, setFormData, onChangeExtra)}
              />
            </div>
          ))}
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={e => handleChange(e, setFormData, onChangeExtra)}
            />
          </div>
        </div>
      </Modal>
    )
  )
}

export default CreateQuotationModal