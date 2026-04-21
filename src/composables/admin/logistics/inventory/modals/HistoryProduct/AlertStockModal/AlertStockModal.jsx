import React, { useState } from 'react';
import Modal from '@/components/custom/modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Bell, Mail } from 'lucide-react';

const AlertStockModal = ({ open, setOpen, productName, onSave }) => {
  const [threshold, setThreshold] = useState(20);
  const [notifySystem, setNotifySystem] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);

  const handleSave = async () => {
    const config = { threshold, notifySystem, notifyEmail };
    console.log("Alerta configurada:", config);
    
    if (onSave) {
      await onSave(config);
    }
    
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
          <span className="text-sm sm:text-lg">Configurar Alerta</span>
        </div>
      }
      description={`Stock mínimo para ${productName}`}
      size="sm"
      callBack={handleSave}
    >
      <div className="flex flex-col gap-4 sm:gap-5 py-3 sm:py-4">
        
        {/* Umbral de Stock */}
        <div className="space-y-2">
          <Label htmlFor="threshold" className="text-xs sm:text-sm font-semibold">
            Umbral de Stock Bajo
          </Label>
          <Input 
            id="threshold" 
            type="number" 
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            min="0"
            className="w-full h-9 sm:h-10 text-sm" 
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Notificar cuando el stock sea menor a esta cantidad
          </p>
        </div>
        
        {/* Notificar vía */}
        <div className="space-y-3">
          <Label className="text-xs sm:text-sm font-semibold">Notificar vía</Label>
          
          <div className="flex flex-col sm:flex-row gap-2">
            
            <label className="flex items-center gap-3 flex-1 border p-2 sm:p-3 rounded-md hover:bg-muted/50 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifySystem}
                onChange={(e) => setNotifySystem(e.target.checked)}
                className="accent-primary" 
              />
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Sistema</span>
            </label>
            
            <label className="flex items-center gap-3 flex-1 border p-2 sm:p-3 rounded-md hover:bg-muted/50 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="accent-primary" 
              />
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Correo</span>
            </label>
            
          </div>
        </div>
        
        {/* Indicador visual del umbral */}
        <div className="mt-2 p-2 sm:p-3 bg-amber-50 rounded-md border border-amber-200">
          <p className="text-[10px] sm:text-xs text-amber-700 text-center">
            ⚡ Alerta cuando stock {'<'} {threshold} unidades
          </p>
        </div>
        
      </div>
    </Modal>
  );
};

export default AlertStockModal;