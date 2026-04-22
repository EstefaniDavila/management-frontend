import React from 'react';
import Modal from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const DeleteProductModal = ({ open, setOpen, product, onConfirm }) => {
  if (!product) return null;

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Eliminar Producto"
      description={`¿Eliminar "${product.desc}"?`}
      size="sm"
      callBack={null}
    >
      <div className="flex flex-col gap-4 py-4">
        
        <p className="text-sm text-muted-foreground">
          Esta acción no se puede deshacer. El producto será eliminado permanentemente.
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm?.(product)}
            className="w-full sm:w-auto gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default DeleteProductModal;