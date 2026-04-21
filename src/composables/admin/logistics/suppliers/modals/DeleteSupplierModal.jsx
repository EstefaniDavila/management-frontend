import React from 'react';
import Modal from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';

const DeleteSupplierModal = ({
    open,
    setOpen,
    title = "Confirmar Eliminación",
    itemName = "",
    onConfirm,
    isLoading = false
}) => {

    return (
        <Modal
            open={open}
            setOpen={setOpen}
            title={
                <div className="flex items-center gap-2 text-destructive">
                    <Trash2 className="h-5 w-5" />
                    <span>{title}</span>
                </div>
            }
            description="Esta acción es permanente."
            size="sm"
            callBack={null} 
        >
            <div className="flex flex-col gap-6 py-4">

                <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                            ¿Estás seguro de que deseas eliminar?
                        </p>
                        <p className="font-bold text-base px-2 break-all">
                            {itemName}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="w-full sm:w-auto h-9 text-xs"
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="w-full sm:w-auto gap-2 h-9 text-xs font-semibold shadow-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        Confirmar Eliminación
                    </Button>
                </div>

            </div>
        </Modal>
    );
};

export default DeleteSupplierModal;