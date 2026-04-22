import React, { useState, useEffect } from 'react'
import {
    SheetMultiStep,
    SheetMultiStepContent,
    SheetMultiStepHeader,
    SheetMultiStepTitle,
    SheetMultiStepDescription,
    SheetMultiStepFooter,
} from '@/components/custom/SheetMultiStep'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { handleChange } from '@/services/general/handlers'

const UpdateQuotationModal = ({ isOpen, handleClose, quotation, onUpdate }) => {
    const [formData, setFormData] = useState({})
    const onChangeExtra = () => {}

    useEffect(() => {
        if (quotation) setFormData({ ...quotation })
    }, [quotation, isOpen])

    const handleSubmit = () => {
        onUpdate(formData)
        handleClose()
    }

    if (!quotation) return null

    return (
    <SheetMultiStep open={isOpen} onOpenChange={handleClose}>
        <SheetMultiStepContent side="right" className="flex flex-col h-full">
        <SheetMultiStepHeader className="mb-6">
            <SheetMultiStepTitle>Editar Cotización</SheetMultiStepTitle>
            <SheetMultiStepDescription>
                Modifica los campos de la cotización {quotation.code}.
            </SheetMultiStepDescription>
        </SheetMultiStepHeader>

        <div className="flex flex-col gap-6 flex-1">
            <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Datos del Cliente
            </p>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label>Cliente</Label>
                    <Input
                    name="customer"
                    value={formData.customer || ''}
                    onChange={e => handleChange(e, setFormData, onChangeExtra)}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label>RUC / DNI</Label>
                    <Input
                        name="document"
                        value={formData.document || ''}
                        onChange={e => handleChange(e, setFormData, onChangeExtra)}
                    />
                </div>
            </div>
            </div>

            <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Detalle de Cotización
            </p>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                <Label>Código</Label>
                <Input
                    name="code"
                    value={formData.code || ''}
                    disabled
                    className="opacity-50 cursor-not-allowed"
                />
                <span className="text-xs text-muted-foreground">El código no puede modificarse.</span>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label>Asesor</Label>
                    <Input
                        name="advisor"
                        value={formData.advisor || ''}
                        onChange={e => handleChange(e, setFormData, onChangeExtra)}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                <Label>Equipo</Label>
                <Input
                    name="equipment"
                    value={formData.equipment || ''}
                    onChange={e => handleChange(e, setFormData, onChangeExtra)}
                />
                </div>
                <div className="flex flex-col gap-1.5">
                <Label>Monto (S/)</Label>
                <Input
                    type="number"
                    name="amount"
                    value={formData.amount || ''}
                    onChange={e => handleChange(e, setFormData, onChangeExtra)}
                />
                </div>
                <div className="flex flex-col gap-1.5">
                <Label>Fecha</Label>
                <Input
                    type="date"
                    name="date"
                    value={formData.date || ''}
                    onChange={e => handleChange(e, setFormData, onChangeExtra)}
                />
                </div>
            </div>
            </div>
        </div>
        <SheetMultiStepFooter className="mt-auto pt-6 border-t">
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>Actualizar Cotización</Button>
        </SheetMultiStepFooter>
        </SheetMultiStepContent>
    </SheetMultiStep>
    )
}
export default UpdateQuotationModal