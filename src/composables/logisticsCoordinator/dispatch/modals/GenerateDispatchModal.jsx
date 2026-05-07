import React, { useState } from 'react';
import Modal from '@/components/custom/modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Truck,
  User,
  AlertCircle,
  FileText,
  Send,
  Package,
  MapPin,
  Phone
} from 'lucide-react';

const GenerateDispatchModal = ({ open, setOpen, onConfirm, orderData }) => {
  const [formData, setFormData] = useState({
    vehicle: '',
    driver: '',
    observations: ''
  });

  const [errors, setErrors] = useState({});

  const availableVehicles = [
    { id: 'V-001', placa: 'ABC-123', tipo: 'Camión', capacidad: '5 ton', estado: 'Disponible' },
    { id: 'V-002', placa: 'XYZ-789', tipo: 'Camión', capacidad: '3.5 ton', estado: 'Disponible' },
    { id: 'V-003', placa: 'MOTO-01', tipo: 'Moto', capacidad: '200 kg', estado: 'Disponible' },
    { id: 'V-004', placa: 'DEF-456', tipo: 'Camión', capacidad: '8 ton', estado: 'Mantenimiento' },
    { id: 'V-005', placa: 'MOTO-02', tipo: 'Moto', capacidad: '150 kg', estado: 'Disponible' },
  ];

  const availableDrivers = [
    { id: 'D-001', nombre: 'Juan Pérez', licencia: 'A1', telefono: '987654321', disponible: true },
    { id: 'D-002', nombre: 'Carlos López', licencia: 'A2', telefono: '976543210', disponible: true },
    { id: 'D-003', nombre: 'María Rodríguez', licencia: 'B1', telefono: '965432187', disponible: false },
    { id: 'D-004', nombre: 'Luis Fernández', licencia: 'A1', telefono: '954321876', disponible: true },
    { id: 'D-005', nombre: 'Ana Torres', licencia: 'B2', telefono: '943218765', disponible: true },
  ];

  const vehiclesDisponibles = availableVehicles.filter(v => v.estado === 'Disponible');
  const driversDisponibles = availableDrivers.filter(d => d.disponible);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicle) newErrors.vehicle = 'Seleccione un vehículo';
    if (!formData.driver) newErrors.driver = 'Seleccione un conductor';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const dispatchData = {
      ...formData,
      vehicleDetails: availableVehicles.find(v => v.id === formData.vehicle),
      driverDetails: availableDrivers.find(d => d.id === formData.driver),
      orderData: orderData,
      fecha: new Date().toISOString(),
      guiaNumero: `GUID-${Date.now()}`
    };
    
    console.log('Generando guía de despacho:', dispatchData);
    
    if (onConfirm) {
      await onConfirm(dispatchData);
    }
    
    setOpen(false);
    setFormData({ vehicle: '', driver: '', observations: '' });
  };

  const selectedVehicle = availableVehicles.find(v => v.id === formData.vehicle);
  const selectedDriver = availableDrivers.find(d => d.id === formData.driver);

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <span className="text-sm sm:text-base">Generar Guía de Despacho</span>
        </div>
      }
      description="Complete los datos para asignar vehículo y conductor"
      size="lg"
      callBack={null}
    >
      <div className="flex flex-col gap-5 py-2 h-full max-h-[75vh] overflow-y-auto">
        
        {orderData && (
          <div className="p-3 bg-muted/30 rounded-lg border">
            <p className="text-[10px] uppercase text-muted-foreground mb-2">Información de la Orden</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-muted-foreground">Orden N°:</span>
              <span className="font-medium">{orderData.oc || 'OC-001'}</span>
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium">{orderData.cliente || 'Empresa SAC'}</span>
              <span className="text-muted-foreground">Productos:</span>
              <span className="font-medium">{orderData.productos || '3 items'}</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Seleccionar Vehículo <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.vehicle} 
            onValueChange={(val) => setFormData({...formData, vehicle: val})}
          >
            <SelectTrigger className={`w-full ${errors.vehicle ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="-- Seleccione un vehículo --" />
            </SelectTrigger>
            <SelectContent>
              {vehiclesDisponibles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  <div className="flex items-center justify-between w-full gap-4">
                    <span className="font-mono font-bold">{vehicle.placa}</span>
                    <span className="text-xs text-muted-foreground">{vehicle.tipo}</span>
                    <span className="text-xs text-muted-foreground">{vehicle.capacidad}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vehicle && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.vehicle}
            </p>
          )}

          {selectedVehicle && (
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>Vehículo disponible - Capacidad: {selectedVehicle.capacidad}</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Seleccionar Conductor <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.driver} 
            onValueChange={(val) => setFormData({...formData, driver: val})}
          >
            <SelectTrigger className={`w-full ${errors.driver ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="-- Seleccione un conductor --" />
            </SelectTrigger>
            <SelectContent>
              {driversDisponibles.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  <div className="flex items-center justify-between w-full gap-4">
                    <span className="font-medium">{driver.nombre}</span>
                    <span className="text-xs text-muted-foreground">Lic. {driver.licencia}</span>
                    <span className="text-xs text-muted-foreground">{driver.telefono}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.driver && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.driver}
            </p>
          )}
          
          {selectedDriver && (
            <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-md text-xs">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span>Contacto: {selectedDriver.nombre} - {selectedDriver.telefono}</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Observaciones
          </Label>
          <Textarea
            placeholder="Ej: Cuidado, mercadería frágil | Llamar antes de llegar | Entregar en puerta trasera"
            value={formData.observations}
            onChange={(e) => setFormData({...formData, observations: e.target.value})}
            className="min-h-[100px] resize-none"
          />
          <p className="text-[10px] text-muted-foreground">
            Sugerencias: "Mercadería frágil", "Llamar antes de llegar", "Entregar en horario de oficina"
          </p>
        </div>

        {(formData.vehicle || formData.driver || formData.observations) && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400 mb-2">Resumen del Despacho</p>
            <div className="space-y-1 text-xs">
              {formData.vehicle && selectedVehicle && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehículo:</span>
                  <span className="font-medium">{selectedVehicle.placa} ({selectedVehicle.tipo})</span>
                </div>
              )}
              {formData.driver && selectedDriver && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conductor:</span>
                  <span className="font-medium">{selectedDriver.nombre}</span>
                </div>
              )}
              {formData.observations && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Observaciones:</span>
                  <span className="font-medium truncate max-w-[200px]">{formData.observations}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-4 sticky bottom-0 bg-background py-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700"
            disabled={!formData.vehicle || !formData.driver}
          >
            <Send className="h-4 w-4" />
            Generar Guía y Despachar
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default GenerateDispatchModal;