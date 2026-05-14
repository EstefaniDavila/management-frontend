import React, { useState } from 'react';
import Modal from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import OrderInfo from './OrderInfo';
import ProductsList from './ProductsList';
import DeliveryForm from './DeliveryForm';
import useEntityMutation from '@/hooks/useEntityMutation';

const AGenerateDispatchModal = ({
  open,
  setOpen,
  onConfirm,
  orderData,
  dispatchItems = [],
  isLoadingItems = false
}) => {
  const [formData, setFormData] = useState({
    vehicle: '',
    driver: '',
    observations: '',
    destination_address: ''
  });

  const [currentItems, setCurrentItems] = useState(dispatchItems);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryGuideMutation = useEntityMutation({ entityName: 'delivery_guide' });
  const dispatchOrderMutation = useEntityMutation({ entityName: 'dispatch_order' });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicle) newErrors.vehicle = 'Seleccione un vehículo';
    if (!formData.driver) newErrors.driver = 'Seleccione un conductor';
    if (!formData.destination_address) newErrors.destination_address = 'Ingrese la dirección de destino';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasItems = currentItems.length > 0;
  const allItemsChecked = hasItems && currentItems.every(item => item.checked);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!allItemsChecked) {
      alert('Debes verificar todos los productos antes de generar la guía');
      return;
    }

    setIsSubmitting(true);

    try {

      const deliveryGuide = await deliveryGuideMutation.mutateAsync({
        action: 'create',
        endpoint: '/api/v1/admin/delivery_guides',
        entity: {
          dispatch_order_id: orderData?.id,
          driver_id: formData.driver,
          vehicle_id: formData.vehicle,
          destination_address: formData.destination_address,
          status: 'pending'
        }
      });

      await dispatchOrderMutation.mutateAsync({
        action: 'update',
        endpoint: `/api/v1/admin/dispatch_orders/${orderData?.id}/process_dispatch`,
        entity: {}
      });

      if (onConfirm) {
        await onConfirm({ success: true, deliveryGuide });
      }

      setOpen(false);
      setFormData({ vehicle: '', driver: '', observations: '', destination_address: '' });

    } catch (error) {
      console.error('Error al generar despacho:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.vehicle && formData.driver && formData.destination_address;
  const canSubmit = isFormValid && (!hasItems || allItemsChecked) && !isSubmitting;

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Generar Guía de Despacho"
      description="Complete los datos para asignar vehículo y conductor"
      size="lg"
      callBack={null}
    >
      <div className="flex flex-col gap-5 py-2 h-full max-h-[80vh] overflow-y-auto">
        <OrderInfo orderData={orderData} />

        <ProductsList
          items={currentItems}
          isLoading={isLoadingItems}
          dispatchOrderId={orderData?.id}
          onItemsChange={setCurrentItems}
        />

        <DeliveryForm
          formData={formData}
          onChange={handleChange}
          errors={errors}
        />

        <div className="flex flex-col sm:flex-row gap-2 pt-4 sticky bottom-0 bg-background py-2 border-t">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            disabled={!canSubmit}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Generar Guía y Despachar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AGenerateDispatchModal;