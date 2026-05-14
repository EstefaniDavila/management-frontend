import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Truck, User, Phone, AlertCircle, Loader2 } from 'lucide-react';
import useCrud from '@/hooks/useCrud';

const DeliveryForm = ({ formData, onChange, errors = {} }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(false);


    const DEFAULT_DRIVER_ID = 'db89f2e8-57fd-428d-beb0-40e0065c62dc';

    const { getModel } = useCrud('/api/v1/admin/vehicles?status=logistic');

    useEffect(() => {
        loadVehicles();

        onChange('driver', DEFAULT_DRIVER_ID);
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

            <div className="hidden">
                <input
                    type="hidden"
                    value={DEFAULT_DRIVER_ID}
                    onChange={() => { }}
                />
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