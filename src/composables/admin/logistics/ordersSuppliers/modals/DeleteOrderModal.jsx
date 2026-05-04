import React from 'react';
import Modal from '@/components/custom/modal';
import { AlertTriangle } from 'lucide-react';

const DeleteOrderModal = ({ open, setOpen, order, onConfirm }) => {
  if (!order) return null;

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span>Anular Pedido</span>
        </div>
      }
      description="Esta acción es irreversible."
      size="sm"
      callBack={() => onConfirm(order)}
      btnCancel="Cancelar"
      btnSubmit="Anular Pedido"
    >
      <div className="py-4">
        <p className="text-sm text-foreground">
          ¿Estás seguro de que deseas anular el pedido <strong>{order.orderId}</strong> del proveedor <strong>{order.proveedor}</strong>?
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          El monto de ${order.montoTotal} dejará de estar contabilizado.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteOrderModal;
