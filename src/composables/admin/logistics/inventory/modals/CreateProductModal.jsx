import React, { useState, useEffect } from 'react'
import Modal from '@/components/custom/modal'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

const CreateProductModal = ({ open, setOpen, onSave, currentUserId }) => { // Necesitas pasar el usuario actual

  const [tipoProducto, setTipoProducto] = useState('repuesto')
  const [modelos, setModelos] = useState([]) // Debes cargar desde tu API
  const [categorias, setCategorias] = useState([]) // Debes cargar desde tu API

  const [formData, setFormData] = useState({
    // Campos para tabla productos
    tipo: 'repuesto',
    codigo: '',
    nombre: '',
    descripcion: '',
    precio_base: 0,
    creado_por: currentUserId, // ID del usuario logueado
    activo: true,

    // Campos para tabla vehiculos
    vehiculo: {
      modelo_id: '',
      serie: '',
      anio_fabricacion: new Date().getFullYear(),
      horas_uso: 0,
      estado: 'disponible',
      precio_hora: 0,
      precio_dia: 0
    },

    // Campos para tabla repuestos
    repuesto: {
      categoria_id: '',
      part_number: '',
      marca_fabricante: '',
      stock: 0,
      stock_minimo: 1,
      unidad_venta: 'und',
      es_critico: false
    }
  })

  // Cargar modelos y categorías desde tu API
  useEffect(() => {
    if (open) {
      // Aquí deberías hacer fetch a tu API
      // fetch('/api/modelos_vehiculo').then(res => res.json()).then(setModelos)
      // fetch('/api/categorias_repuesto').then(res => res.json()).then(setCategorias)

      // Datos de ejemplo de tu BD
      setModelos([
        { id: 1, nombre: 'CAT 320' },
        { id: 2, nombre: 'Komatsu PC210' },
        { id: 3, nombre: 'CAT 950M' },
        // ... más modelos
      ])

      setCategorias([
        { id: 1, nombre: 'Componentes Críticos' },
        { id: 2, nombre: 'Tren de Rodaje' },
        { id: 3, nombre: 'G.E.T - Elementos de Desgaste' },
        { id: 4, nombre: 'Consumibles' }
      ])
    }
  }, [open])

  const handleCommonChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleVehiculoChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      vehiculo: { ...prev.vehiculo, [name]: value }
    }))
  }

  const handleRepuestoChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      repuesto: { ...prev.repuesto, [name]: value }
    }))
  }

  const handleActionSave = async () => {
    // Validaciones básicas
    if (!formData.codigo) {
      alert("El código es obligatorio")
      return
    }

    if (!formData.nombre) {
      alert("El nombre es obligatorio")
      return
    }

    if (formData.precio_base <= 0) {
      alert("El precio base debe ser mayor a 0")
      return
    }

    if (tipoProducto === 'vehiculo') {
      if (!formData.vehiculo.modelo_id) {
        alert("Debe seleccionar un modelo de vehículo")
        return
      }
      if (!formData.vehiculo.serie) {
        alert("El número de serie es obligatorio")
        return
      }
      if (!formData.vehiculo.anio_fabricacion) {
        alert("El año de fabricación es obligatorio")
        return
      }
    }

    if (tipoProducto === 'repuesto') {
      if (!formData.repuesto.categoria_id) {
        alert("Debe seleccionar una categoría")
        return
      }
      if (!formData.repuesto.part_number) {
        alert("El número de parte es obligatorio")
        return
      }
      if (formData.repuesto.stock < 0) {
        alert("El stock no puede ser negativo")
        return
      }
    }

    // Enviar datos estructurados para insertar en ambas tablas
    const dataToSave = {
      tipo: tipoProducto,
      producto: {
        codigo: formData.codigo,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio_base: parseFloat(formData.precio_base),
        creado_por: currentUserId,
        activo: true
      },
      ...(tipoProducto === 'vehiculo' && {
        vehiculo: {
          modelo_id: parseInt(formData.vehiculo.modelo_id),
          serie: formData.vehiculo.serie,
          anio_fabricacion: parseInt(formData.vehiculo.anio_fabricacion),
          horas_uso: parseFloat(formData.vehiculo.horas_uso) || 0,
          estado: formData.vehiculo.estado,
          precio_hora: parseFloat(formData.vehiculo.precio_hora) || null,
          precio_dia: parseFloat(formData.vehiculo.precio_dia) || null
        }
      }),
      ...(tipoProducto === 'repuesto' && {
        repuesto: {
          categoria_id: parseInt(formData.repuesto.categoria_id),
          part_number: formData.repuesto.part_number,
          marca_fabricante: formData.repuesto.marca_fabricante,
          stock: parseInt(formData.repuesto.stock),
          stock_minimo: parseInt(formData.repuesto.stock_minimo),
          unidad_venta: formData.repuesto.unidad_venta,
          es_critico: formData.repuesto.es_critico
        }
      })
    }

    await onSave(dataToSave)
  }

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (!open) {
      setTipoProducto('repuesto')
      setFormData({
        tipo: 'repuesto',
        codigo: '',
        nombre: '',
        descripcion: '',
        precio_base: 0,
        creado_por: currentUserId,
        activo: true,
        vehiculo: {
          modelo_id: '',
          serie: '',
          anio_fabricacion: new Date().getFullYear(),
          horas_uso: 0,
          estado: 'disponible',
          precio_hora: 0,
          precio_dia: 0
        },
        repuesto: {
          categoria_id: '',
          part_number: '',
          marca_fabricante: '',
          stock: 0,
          stock_minimo: 1,
          unidad_venta: 'und',
          es_critico: false
        }
      })
    }
  }, [open, currentUserId])

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Nuevo Producto"
      description="Complete los campos según el tipo de producto a registrar."
      size="lg"
      callBack={handleActionSave}
    >
      <div className="grid gap-4 py-5 max-h-[60vh] overflow-y-auto px-2">

        {/* Selector de tipo de producto */}
        <div className="flex flex-col gap-2">
          <Label>Tipo de Producto *</Label>
          <Select
            value={tipoProducto}
            onValueChange={setTipoProducto}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="repuesto">Repuesto</SelectItem>
              <SelectItem value="vehiculo">Vehículo / Maquinaria</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campos comunes */}
        <div className="border-t pt-4 mt-2">
          <h3 className="font-medium mb-3">Información General</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                name="codigo"
                placeholder="Ej: VEH-001 o REP-001"
                value={formData.codigo}
                onChange={handleCommonChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="precio_base">Precio Base *</Label>
              <Input
                id="precio_base"
                name="precio_base"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.precio_base}
                onChange={handleCommonChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              name="nombre"
              placeholder="Nombre del producto"
              value={formData.nombre}
              onChange={handleCommonChange}
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder="Descripción detallada del producto"
              rows={3}
              value={formData.descripcion}
              onChange={handleCommonChange}
            />
          </div>
        </div>

        {/* Campos específicos para VEHÍCULOS */}
        {tipoProducto === 'vehiculo' && (
          <div className="border-t pt-4 mt-2">
            <h3 className="font-medium mb-3">Información del Vehículo</h3>

            <div className="flex flex-col gap-2">
              <Label htmlFor="modelo_id">Modelo *</Label>
              <Select
                value={formData.vehiculo.modelo_id}
                onValueChange={(val) => setFormData(prev => ({
                  ...prev,
                  vehiculo: { ...prev.vehiculo, modelo_id: val }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un modelo" />
                </SelectTrigger>
                <SelectContent>
                  {modelos.map(modelo => (
                    <SelectItem key={modelo.id} value={modelo.id.toString()}>
                      {modelo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="serie">Número de Serie *</Label>
                <Input
                  id="serie"
                  name="serie"
                  placeholder="Ej: CAT320-AQ2021-001"
                  value={formData.vehiculo.serie}
                  onChange={handleVehiculoChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="anio_fabricacion">Año Fabricación *</Label>
                <Input
                  id="anio_fabricacion"
                  name="anio_fabricacion"
                  type="number"
                  placeholder="2024"
                  value={formData.vehiculo.anio_fabricacion}
                  onChange={handleVehiculoChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="horas_uso">Horas de Uso</Label>
                <Input
                  id="horas_uso"
                  name="horas_uso"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={formData.vehiculo.horas_uso}
                  onChange={handleVehiculoChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.vehiculo.estado}
                  onValueChange={(val) => setFormData(prev => ({
                    ...prev,
                    vehiculo: { ...prev.vehiculo, estado: val }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="alquilado">Alquilado</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="precio_hora">Precio por Hora</Label>
                <Input
                  id="precio_hora"
                  name="precio_hora"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.vehiculo.precio_hora}
                  onChange={handleVehiculoChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="precio_dia">Precio por Día</Label>
                <Input
                  id="precio_dia"
                  name="precio_dia"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.vehiculo.precio_dia}
                  onChange={handleVehiculoChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Campos específicos para REPUESTOS */}
        {tipoProducto === 'repuesto' && (
          <div className="border-t pt-4 mt-2">
            <h3 className="font-medium mb-3">Información del Repuesto</h3>

            <div className="flex flex-col gap-2">
              <Label htmlFor="categoria_id">Categoría *</Label>
              <Select
                value={formData.repuesto.categoria_id}
                onValueChange={(val) => setFormData(prev => ({
                  ...prev,
                  repuesto: { ...prev.repuesto, categoria_id: val }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(cat => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="part_number">Número de Parte *</Label>
                <Input
                  id="part_number"
                  name="part_number"
                  placeholder="Ej: 1U-3302"
                  value={formData.repuesto.part_number}
                  onChange={handleRepuestoChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="marca_fabricante">Marca / Fabricante</Label>
                <Input
                  id="marca_fabricante"
                  name="marca_fabricante"
                  placeholder="Ej: Caterpillar, Komatsu"
                  value={formData.repuesto.marca_fabricante}
                  onChange={handleRepuestoChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={formData.repuesto.stock}
                  onChange={handleRepuestoChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="stock_minimo">Stock Mínimo</Label>
                <Input
                  id="stock_minimo"
                  name="stock_minimo"
                  type="number"
                  placeholder="1"
                  value={formData.repuesto.stock_minimo}
                  onChange={handleRepuestoChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="unidad_venta">Unidad de Venta</Label>
                <Select
                  value={formData.repuesto.unidad_venta}
                  onValueChange={(val) => setFormData(prev => ({
                    ...prev,
                    repuesto: { ...prev.repuesto, unidad_venta: val }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="und">Unidad</SelectItem>
                    <SelectItem value="par">Par</SelectItem>
                    <SelectItem value="caja_20">Caja x20</SelectItem>
                    <SelectItem value="balde_18L">Balde 18L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="es_critico"
                checked={formData.repuesto.es_critico}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  repuesto: { ...prev.repuesto, es_critico: e.target.checked }
                }))}
                className="w-4 h-4"
              />
              <Label htmlFor="es_critico" className="cursor-pointer">
                ¿Es un repuesto crítico?
              </Label>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default CreateProductModal