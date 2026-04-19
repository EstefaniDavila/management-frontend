import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle, X, Check } from "lucide-react";

const DeleteProductModal = ({ product, onDelete, children }) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    

    await new Promise(resolve => setTimeout(resolve, 300));
    
    onDelete(product);
    setOpen(false);
    setIsDeleting(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-red-50 dark:hover:bg-red-950/50" title="Eliminar">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-950/50">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Eliminar Producto
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            ¿Estás seguro de que deseas eliminar este producto?
          </p>
          
          {product && (
            <div className="mt-4 p-4 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                Producto a eliminar:
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-mono">{product.id}</span> - {product.desc}
              </p>
              {product.loc && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ubicación: {product.loc}
                </p>
              )}
            </div>
          )}
          
          <p className="text-sm text-red-600 dark:text-red-400 mt-4 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Esta acción no se puede deshacer
          </p>
        </div>

        <DialogFooter className="border-t border-gray-200 dark:border-gray-800 pt-4 gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="gap-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Eliminar Producto
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductModal;