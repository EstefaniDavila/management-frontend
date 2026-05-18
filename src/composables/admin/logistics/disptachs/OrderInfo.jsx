import React from 'react';

const OrderInfo = ({ orderData }) => {
  if (!orderData) return null;

  return (
    <div className="p-3 bg-muted/30 rounded-lg border">
      <p className="text-[10px] uppercase text-muted-foreground mb-2">
        Información de la Orden
      </p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <span className="text-muted-foreground">Orden N°:</span>
        <span className="font-medium">{orderData.code || orderData.oc || 'N/A'}</span>
        <span className="text-muted-foreground">Tipo:</span>
        <span className="font-medium">{orderData.type || 'Despacho'}</span>
        <span className="text-muted-foreground">Fecha:</span>
        <span className="font-medium">{orderData.fecha || new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default OrderInfo;
