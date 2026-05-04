import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import Modal from '@/components/custom/modal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCommonForm } from './ProductCommonForm'
import { VehicleForm } from './VehicleForm'
import { SparePartForm } from './SparePartForm'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Esquemas de validación
const commonSchema = z.object({
  code: z.string().min(1, "El código es obligatorio"),
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  base_price: z.number().positive("El precio base debe ser mayor a 0"),
  active: z.boolean().default(true),
})

const vehicleSchema = z.object({
  vehicle_model_id: z.string().min(1, "Debe seleccionar un modelo"),
  serial: z.string().min(1, "El número de serie es obligatorio"),
  manufacture_year: z.number()
    .min(1990, "El año debe ser mayor o igual a 1990")
    .max(new Date().getFullYear(), `El año no puede superar ${new Date().getFullYear()}`),
  hours_used: z.number().min(0, "Las horas no pueden ser negativas").default(0),
  status: z.enum(['available', 'rented', 'maintenance', 'inactive']),
  price_per_hour: z.number().min(0, "El precio por hora no puede ser negativo").optional(),
  price_per_day: z.number().min(0, "El precio por día no puede ser negativo").optional(),
  location: z.string().optional(),
})

const sparePartSchema = z.object({
  spare_part_category_id: z.string().min(1, "Debe seleccionar una categoría"),
  part_number: z.string().min(1, "El número de parte es obligatorio"),
  manufacturer_brand: z.string().optional(),
  stock: z.number().min(0, "El stock no puede ser negativo"),
  min_stock: z.number().min(0, "El stock mínimo no puede ser negativo"),
  sale_unit: z.enum(['unidad', 'caja', 'par', 'kit']),
  is_critical: z.boolean().default(false),
})

const getProductSchema = (type) => {
  if (type === 'vehicle') {
    return z.object({
      common: commonSchema,
      vehicle: vehicleSchema
    })
  }
  return z.object({
    common: commonSchema,
    spare_part: sparePartSchema
  })
}

const CreateProductModal = ({ open, setOpen, onSave, currentUserId }) => {
  const [productType, setProductType] = useState('spare_part')
  const [isLoading, setIsLoading] = useState(false)
  const [vehicleModels, setVehicleModels] = useState([])
  const [sparePartCategories, setSparePartCategories] = useState([])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(getProductSchema(productType)),
    defaultValues: {
      common: {
        code: '',
        name: '',
        description: '',
        base_price: 0,
        active: true,
      },
      vehicle: {
        vehicle_model_id: '',
        serial: '',
        manufacture_year: new Date().getFullYear(),
        hours_used: 0,
        status: 'available',
        price_per_hour: 0,
        price_per_day: 0,
        location: '',
      },
      spare_part: {
        spare_part_category_id: '',
        part_number: '',
        manufacturer_brand: '',
        stock: 0,
        min_stock: 1,
        sale_unit: 'unidad',
        is_critical: false,
      }
    }
  })

  useEffect(() => {
    if (open) {
      loadVehicleModels()
      loadSparePartCategories()
    }
  }, [open])

  const loadVehicleModels = async () => {
    try {
      const response = await fetch('/api/v1/admin/vehicle_models')
      const data = await response.json()
      setVehicleModels(data.data || [])
    } catch (error) {
      console.error('Error loading vehicle models:', error)
      toast.error('Error al cargar los modelos de vehículos')
    }
  }

  const loadSparePartCategories = async () => {
    try {
      const response = await fetch('/api/v1/admin/spare_part_categories')
      const data = await response.json()
      setSparePartCategories(data.data || [])
    } catch (error) {
      console.error('Error loading spare part categories:', error)
      toast.error('Error al cargar las categorías de repuestos')
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const payload = {
        product: {
          product_type: productType,
          code: data.common.code,
          name: data.common.name,
          description: data.common.description,
          base_price: data.common.base_price,
          active: data.common.active,
          created_by_id: currentUserId,
          updated_by_id: currentUserId,
        }
      }

      if (productType === 'vehicle') {
        payload.product.vehicle_attributes = {
          vehicle_model_id: data.vehicle.vehicle_model_id,
          serial: data.vehicle.serial,
          manufacture_year: data.vehicle.manufacture_year,
          hours_used: data.vehicle.hours_used,
          status: data.vehicle.status,
          price_per_hour: data.vehicle.price_per_hour,
          price_per_day: data.vehicle.price_per_day,
          location: data.vehicle.location,
        }
      } else {
        payload.product.spare_part_attributes = {
          spare_part_category_id: data.spare_part.spare_part_category_id,
          part_number: data.spare_part.part_number,
          manufacturer_brand: data.spare_part.manufacturer_brand,
          stock: data.spare_part.stock,
          min_stock: data.spare_part.min_stock,
          sale_unit: data.spare_part.sale_unit,
          is_critical: data.spare_part.is_critical,
        }
      }

      await onSave(payload)
      toast.success('Producto creado exitosamente')
      reset()
      setOpen(false)
    } catch (error) {
      console.error('Error creating product:', error)
      if (error.response?.data?.messages) {
        error.response.data.messages.forEach(msg => toast.error(msg))
      } else {
        toast.error('Error al crear el producto')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTypeChange = (newType) => {
    setProductType(newType)
    reset({
      common: watch('common'),
      vehicle: {
        vehicle_model_id: '',
        serial: '',
        manufacture_year: new Date().getFullYear(),
        hours_used: 0,
        status: 'available',
        price_per_hour: 0,
        price_per_day: 0,
        location: '',
      },
      spare_part: {
        spare_part_category_id: '',
        part_number: '',
        manufacturer_brand: '',
        stock: 0,
        min_stock: 1,
        sale_unit: 'unidad',
        is_critical: false,
      }
    })
  }


  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Crear Nuevo Producto"
      description="Complete los campos según el tipo de producto"
      size="2xl"
      showFooter={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-[70vh] md:h-[75vh]">
        <div className="flex-1 overflow-y-auto pr-2 pb-4 custom-scrollbar">
          <Tabs value={productType} onValueChange={handleTypeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sticky top-0 z-10 bg-background">
              <TabsTrigger value="spare_part">Repuesto</TabsTrigger>
              <TabsTrigger value="vehicle">Vehículo / Maquinaria</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <ProductCommonForm control={control} errors={errors.common} />

              <TabsContent value="vehicle" className="mt-6">
                <VehicleForm
                  control={control}
                  errors={errors.vehicle}
                  vehicleModels={vehicleModels}
                />
              </TabsContent>

              <TabsContent value="spare_part" className="mt-6">
                <SparePartForm
                  control={control}
                  errors={errors.spare_part}
                  sparePartCategories={sparePartCategories}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t bg-background pb-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear Producto
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateProductModal
