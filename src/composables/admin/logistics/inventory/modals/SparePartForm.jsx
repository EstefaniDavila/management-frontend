import React from 'react'
import { useController } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

const saleUnitOptions = [
    { value: 'unidad', label: 'Unidad' },
    { value: 'caja', label: 'Caja' },
    { value: 'par', label: 'Par' },
    { value: 'kit', label: 'Kit' }
]

export const SparePartForm = ({ control, errors, sparePartCategories }) => {
    const { field: categoryField } = useController({
        name: 'spare_part.spare_part_category_id',
        control,
        rules: { required: true }
    })

    const { field: partNumberField } = useController({
        name: 'spare_part.part_number',
        control,
        rules: { required: true }
    })

    const { field: brandField } = useController({
        name: 'spare_part.manufacturer_brand',
        control
    })

    const { field: stockField } = useController({
        name: 'spare_part.stock',
        control,
        rules: { required: true, min: 0 }
    })

    const { field: minStockField } = useController({
        name: 'spare_part.min_stock',
        control,
        rules: { required: true, min: 0 }
    })

    const { field: saleUnitField } = useController({
        name: 'spare_part.sale_unit',
        control,
        rules: { required: true }
    })

    const { field: isCriticalField } = useController({
        name: 'spare_part.is_critical',
        control
    })

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="spare_part_category_id">
                    Categoría <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={categoryField.value}
                    onValueChange={categoryField.onChange}
                >
                    <SelectTrigger className={errors?.spare_part_category_id ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        {sparePartCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors?.spare_part_category_id && (
                    <p className="text-sm text-red-500">{errors.spare_part_category_id.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="part_number">
                        Número de Parte <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="part_number"
                        placeholder="Ej: 1U-3302"
                        {...partNumberField}
                        className={errors?.part_number ? "border-red-500" : ""}
                    />
                    {errors?.part_number && (
                        <p className="text-sm text-red-500">{errors.part_number.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="manufacturer_brand">Marca / Fabricante</Label>
                    <Input
                        id="manufacturer_brand"
                        placeholder="Ej: Caterpillar, Komatsu, Bosch"
                        {...brandField}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="stock">
                        Stock <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="stock"
                        type="number"
                        placeholder="0"
                        {...stockField}
                        onChange={(e) => stockField.onChange(parseInt(e.target.value))}
                        className={errors?.stock ? "border-red-500" : ""}
                    />
                    {errors?.stock && (
                        <p className="text-sm text-red-500">{errors.stock.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="min_stock">
                        Stock Mínimo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="min_stock"
                        type="number"
                        placeholder="1"
                        {...minStockField}
                        onChange={(e) => minStockField.onChange(parseInt(e.target.value))}
                        className={errors?.min_stock ? "border-red-500" : ""}
                    />
                    {errors?.min_stock && (
                        <p className="text-sm text-red-500">{errors.min_stock.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="sale_unit">
                    Unidad de Venta <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={saleUnitField.value}
                    onValueChange={saleUnitField.onChange}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {saleUnitOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                    id="is_critical"
                    checked={isCriticalField.value}
                    onCheckedChange={isCriticalField.onChange}
                />
                <Label
                    htmlFor="is_critical"
                    className="cursor-pointer"
                >
                    ¿Es un repuesto crítico?
                </Label>
            </div>
        </div>
    )
}