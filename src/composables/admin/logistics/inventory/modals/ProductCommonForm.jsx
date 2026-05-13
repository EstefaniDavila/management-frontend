import React from 'react'
import { useController } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export const ProductCommonForm = ({ control, errors }) => {

    const { field: nameField } = useController({
        name: 'common.name',
        control,
        rules: { required: true }
    })

    const { field: descriptionField } = useController({
        name: 'common.description',
        control
    })

    const { field: basePriceField } = useController({
        name: 'common.base_price',
        control,
        rules: { required: true, min: 0 }
    })

    const { field: activeField } = useController({
        name: 'common.active',
        control
    })

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        placeholder="Nombre del producto"
                        {...nameField}
                        className={errors?.name ? "border-red-500" : ""}
                    />
                    {errors?.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="base_price">
                        Precio Base <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="base_price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...basePriceField}
                        onChange={(e) => basePriceField.onChange(parseFloat(e.target.value))}
                        className={errors?.base_price ? "border-red-500" : ""}
                    />
                    {errors?.base_price && (
                        <p className="text-sm text-red-500">{errors.base_price.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                    id="description"
                    placeholder="Descripción detallada del producto"
                    rows={3}
                    {...descriptionField}
                />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="active"
                    checked={activeField.value}
                    onCheckedChange={activeField.onChange}
                />
                <Label
                    htmlFor="active"
                    className="cursor-pointer"
                >
                    Producto Activo
                </Label>
            </div>
        </div>
    )
}
