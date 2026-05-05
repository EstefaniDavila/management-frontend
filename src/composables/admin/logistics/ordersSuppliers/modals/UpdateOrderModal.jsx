import React, { useState, useEffect } from 'react';
import Modal from '@/components/custom/modal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UpdateOrderModal = ({ open, setOpen, orderToEdit, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (orderToEdit) {
      setFormData({
        orderId: orderToEdit.orderId || '',
        proveedor: orderToEdit.proveedor || '',
        fechaPedido: orderToEdit.fechaPedido || '',
        fechaEntrega: orderToEdit.fechaEntrega || '',
        totalProductos: orderToEdit.totalProductos || 1,
        montoTotal: orderToEdit.montoTotal || 0,
        status: orderToEdit.status || 'PENDIENTE'
      });
    }
  }, [orderToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!orderToEdit) return null;

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Actualizar Pedido"
      description={`Modificando información para la orden: ${formData.orderId}`}
      size="md"
      callBack={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium">Proveedor *</label>
          <Input 
            name="proveedor" 
            value={formData.proveedor} 
            onChange={handleChange} 
            placeholder="Ej. Maquinarias S.A." 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Fecha de Pedido *</label>
          <Input 
            type="date" 
            name="fechaPedido" 
            value={formData.fechaPedido} 
            onChange={handleChange} 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Fecha de Entrega Estimada</label>
          <Input 
            type="date" 
            name="fechaEntrega" 
            value={formData.fechaEntrega} 
            onChange={handleChange} 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Cant. Productos</label>
          <Input 
            type="number" 
            name="totalProductos" 
            value={formData.totalProductos} 
            onChange={handleChange} 
            min="1"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Monto Total ($)</label>
          <Input 
            type="number" 
            name="montoTotal" 
            value={formData.montoTotal} 
            onChange={handleChange} 
            min="0"
            step="0.01"
          />
        </div>

        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium">Estado</label>
          <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDIENTE">Pendiente</SelectItem>
              <SelectItem value="EN_TRANSITO">En Tránsito</SelectItem>
              <SelectItem value="ENTREGADO">Entregado</SelectItem>
              <SelectItem value="CANCELADO">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateOrderModal;
