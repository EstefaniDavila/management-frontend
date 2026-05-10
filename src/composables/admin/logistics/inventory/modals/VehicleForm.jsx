import React, { useState, useEffect } from 'react'
import { useController } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

const statusOptions = [
    { value: 'available', label: 'Disponible' },
    { value: 'rented', label: 'Alquilado' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'inactive', label: 'Inactivo' }
]

export const VehicleForm = ({ control, errors, vehicleModels, vehicleTypes }) => {
    const [selectedTypeId, setSelectedTypeId] = useState('all')

    const { field: modelField } = useController({
        name: 'vehicle.vehicle_model_id',
        control,
        rules: { required: true }
    })

    useEffect(() => {
        modelField.onChange('')
    }, [selectedTypeId])

    const { field: serialField } = useController({
        name: 'vehicle.serial',
        control,
        rules: { required: true }
    })

    const { field: yearField } = useController({
        name: 'vehicle.manufacture_year',
        control,
        rules: { required: true, min: 1990, max: new Date().getFullYear() }
    })

    const { field: hoursField } = useController({
        name: 'vehicle.hours_used',
        control
    })

    const { field: statusField } = useController({
        name: 'vehicle.status',
        control,
        rules: { required: true }
    })

    const { field: priceHourField } = useController({
        name: 'vehicle.price_per_hour',
        control
    })

    const { field: priceDayField } = useController({
        name: 'vehicle.price_per_day',
        control
    })

    const { field: locationField } = useController({
        name: 'vehicle.location',
        control
    })

    const filteredModels = selectedTypeId !== 'all'
        ? vehicleModels.filter(m => m.vehicle_type_id === selectedTypeId)
        : vehicleModels

    const hasModels = filteredModels.length > 0

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="vehicle_type_filter">Tipo de Vehículo</Label>
                <Select
                    value={selectedTypeId}
                    onValueChange={(val) => {
                        setSelectedTypeId(val)
                        modelField.onChange('')
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filtrar por tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        {vehicleTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                                {type.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    Filtra modelos por tipo de vehículo
                </p>
            </div>

            {/* Selector de modelo */}
            <div className="space-y-2">
                <Label htmlFor="vehicle_model_id">
                    Modelo <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={modelField.value}
                    onValueChange={modelField.onChange}
                    disabled={!hasModels && selectedTypeId !== 'all'}
                >
                    <SelectTrigger className={errors?.vehicle_model_id ? "border-red-500" : ""}>
                        <SelectValue placeholder={
                            !hasModels && selectedTypeId !== 'all'
                                ? "No hay modelos para este tipo"
                                : "Seleccione un modelo"
                        } />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredModels.map((model) => (
                            <SelectItem key={model.id} value={model.id.toString()}>
                                {model.brand} {model.model}
                                {model.year && ` (${model.year})`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors?.vehicle_model_id && (
                    <p className="text-sm text-red-500">{errors.vehicle_model_id.message}</p>
                )}
                {!hasModels && selectedTypeId !== 'all' && (
                    <p className="text-sm text-yellow-600">
                        No hay modelos registrados para este tipo de vehículo
                    </p>
                )}
            </div>

            {/* Resto de campos... */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="serial">
                        Número de Serie <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="serial"
                        placeholder="Ej: CAT320-AQ2021-001"
                        {...serialField}
                        className={errors?.serial ? "border-red-500" : ""}
                    />
                    {errors?.serial && (
                        <p className="text-sm text-red-500">{errors.serial.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="manufacture_year">
                        Año de Fabricación <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="manufacture_year"
                        type="number"
                        placeholder="2024"
                        {...yearField}
                        onChange={(e) => yearField.onChange(parseInt(e.target.value))}
                        className={errors?.manufacture_year ? "border-red-500" : ""}
                    />
                    {errors?.manufacture_year && (
                        <p className="text-sm text-red-500">{errors.manufacture_year.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="hours_used">Horas de Uso</Label>
                    <Input
                        id="hours_used"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...hoursField}
                        onChange={(e) => hoursField.onChange(parseFloat(e.target.value))}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">
                        Estado <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={statusField.value}
                        onValueChange={statusField.onChange}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price_per_hour">Precio por Hora</Label>
                    <Input
                        id="price_per_hour"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...priceHourField}
                        onChange={(e) => priceHourField.onChange(parseFloat(e.target.value))}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price_per_day">Precio por Día</Label>
                    <Input
                        id="price_per_day"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...priceDayField}
                        onChange={(e) => priceDayField.onChange(parseFloat(e.target.value))}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                    id="location"
                    placeholder="Ej: Main Warehouse, Zona Norte"
                    {...locationField}
                />
            </div>
        </div>
    )
}