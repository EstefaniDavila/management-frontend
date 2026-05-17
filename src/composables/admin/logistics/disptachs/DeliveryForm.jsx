import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Truck, User, Phone, AlertCircle, Loader2 } from 'lucide-react';
import useCrud from '@/hooks/useCrud';

const DeliveryForm = ({ formData, onChange, errors = {} }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [loadingDrivers, setLoadingDrivers] = useState(false);

    const { getModel } = useCrud('/api/v1/admin/vehicles?status=logistic');
    const { getModel: getDrivers } = useCrud('/api/v1/admin/logistics_users');

    useEffect(() => {
        loadVehicles();
        loadDrivers();
    }, []);

    const loadVehicles = async () => {
        setLoadingVehicles(true);
        try {
            const response = await getModel();
            let vehiclesArray = response?.data || response || [];
            if (!Array.isArray(vehiclesArray)) {
                vehiclesArray = [];
            }
            setVehicles(vehiclesArray);
        } catch (error) {
            console.error('Error cargando vehículos:', error);
            setVehicles([]);
        } finally {
            setLoadingVehicles(false);
        }
    };

    const loadDrivers = async () => {
        setLoadingDrivers(true);
        try {
            const response = await getDrivers();
            let driversArray = response?.data || response || [];
            if (!Array.isArray(driversArray)) driversArray = [];
            setDrivers(driversArray);
        } catch (error) {
            console.error('Error cargando conductores:', error);
        } finally {
            setLoadingDrivers(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Dirección */}
            <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Dirección de Destino <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    placeholder="Ej: Av. Principal 123, San Isidro, Lima"
                    value={formData.destination_address || ''}
                    onChange={(e) => onChange('destination_address', e.target.value)}
                    className={`min-h-[80px] resize-none ${errors.destination_address ? 'border-red-500' : ''}`}
                />
                {errors.destination_address && (
                    <p className="text-xs text-red-500">{errors.destination_address}</p>
                )}
            </div>

            {/* Conductor */}
            <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Conductor <span className="text-red-500">*</span>
                </Label>
                {loadingDrivers ? (
                    <div className="flex items-center gap-2 p-2 border rounded-md">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Cargando conductores...</span>
                    </div>
                ) : (
                    <select
                        className="w-full border rounded-md p-2 bg-background"
                        value={formData.driver || ''}
                        onChange={(e) => onChange('driver', e.target.value)}
                    >
                        <option value="">-- Seleccione un conductor --</option>
                        {drivers.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.full_name} - {d.document_number}
                            </option>
                        ))}
                    </select>
                )}
                {errors.driver && <p className="text-xs text-red-500">{errors.driver}</p>}
            </div>

            {/* Vehículo */}
            <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Seleccionar Vehículo <span className="text-red-500">*</span>
                </Label>
                {loadingVehicles ? (
                    <div className="flex items-center gap-2 p-2 border rounded-md">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Cargando vehículos...</span>
                    </div>
                ) : (
                    <select
                        className="w-full border rounded-md p-2 bg-background"
                        value={formData.vehicle || ''}
                        onChange={(e) => onChange('vehicle', e.target.value)}
                    >
                        <option value="">-- Seleccione un vehículo --</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.serial || v.plate_number || 'S/N'} - {v.product_name || v.vehicle_model || v.model || 'Vehículo'}
                            </option>
                        ))}
                    </select>
                )}
                {errors.vehicle && <p className="text-xs text-red-500">{errors.vehicle}</p>}
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
                <Label className="text-sm font-semibold">Observaciones</Label>
                <Textarea
                    placeholder="Ej: Cuidado, mercadería frágil"
                    value={formData.observations || ''}
                    onChange={(e) => onChange('observations', e.target.value)}
                    className="min-h-[80px] resize-none"
                />
            </div>
        </div>
    );
};

export default DeliveryForm;