import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pencil, 
  Bell, 
  Package, 
  Truck, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

const HistoryProductModal = ({ isOpen, handleClose, product }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product || {});
  const [showAlertConfig, setShowAlertConfig] = useState(false);

  if (!product) return null;

  const movements = [
    { date: "2024-04-16 14:30", type: "Salida", quantity: 3, document: "Pedido P001", responsible: "Juan Pérez" },
    { date: "2024-04-15 09:15", type: "Entrada", quantity: 50, document: "OC-001", responsible: "Carlos López" },
    { date: "2024-04-10 11:00", type: "Salida", quantity: 5, document: "Pedido P089", responsible: "María García" },
    { date: "2024-04-05 16:20", type: "Salida", quantity: 2, document: "Pedido P076", responsible: "Juan Pérez" },
    { date: "2024-04-01 10:00", type: "Entrada", quantity: 30, document: "OC-089", responsible: "Carlos López" },
  ];

  const handleSaveEdit = () => {
    console.log("Guardar cambios:", editedProduct);
    setIsEditing(false);
   
  };

  const handleConfigureAlert = () => {
    console.log("Configurar alerta para:", product.desc);
    setShowAlertConfig(false);
    
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span>Historial de Producto</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              {isEditing ? "Cancelar" : "Editar"}
            </Button>
          </DialogTitle>
          <DialogDescription>
            {product.desc} - Código: {product.id}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">

          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            {!isEditing ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Stock actual</Label>
                  <p className="text-2xl font-bold mt-1">{product.stock} unidades</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Stock mínimo</Label>
                  <p className="text-lg font-semibold mt-1">20 unidades</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Stock máximo</Label>
                  <p className="text-lg font-semibold mt-1">100 unidades</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ubicación</Label>
                  <p className="text-lg font-semibold mt-1">Estante A, fila 3, nivel 2</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Proveedor</Label>
                  <p className="text-lg font-semibold mt-1">Caterpillar Inc.</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Precio</Label>
                  <p className="text-lg font-semibold mt-1">$45.50</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Stock actual</Label>
                  <Input 
                    type="number" 
                    value={editedProduct.stock || product.stock}
                    onChange={(e) => setEditedProduct({...editedProduct, stock: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Stock mínimo</Label>
                  <Input 
                    type="number" 
                    defaultValue="20"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Stock máximo</Label>
                  <Input 
                    type="number" 
                    defaultValue="100"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Ubicación</Label>
                  <Input 
                    defaultValue="Estante A, fila 3, nivel 2"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Proveedor</Label>
                  <Input 
                    defaultValue="Caterpillar Inc."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Precio</Label>
                  <Input 
                    type="number" 
                    defaultValue="45.50"
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2 flex justify-end gap-2 mt-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    Guardar cambios
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              📈 MOVIMIENTOS RECIENTES
            </h3>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">FECHA</th>
                    <th className="text-left p-3 font-semibold">TIPO</th>
                    <th className="text-right p-3 font-semibold">CANTIDAD</th>
                    <th className="text-left p-3 font-semibold">DOCUMENTO</th>
                    <th className="text-left p-3 font-semibold">RESPONSABLE</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-mono text-xs">{movement.date}</td>
                      <td className="p-3">
                        {movement.type === "Entrada" ? (
                          <Badge className="bg-green-500 gap-1">
                            <TrendingUp className="h-3 w-3" /> Entrada
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <TrendingDown className="h-3 w-3" /> Salida
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-right font-semibold">
                        {movement.quantity} unid
                      </td>
                      <td className="p-3 font-mono text-xs">{movement.document}</td>
                      <td className="p-3">{movement.responsible}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              variant="outline" 
              className="gap-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50"
              onClick={() => setShowAlertConfig(true)}
            >
              <Bell className="h-4 w-4" />
              Configurar alerta stock bajo
            </Button>
          </div>
        </div>
      </DialogContent>


      <Dialog open={showAlertConfig} onOpenChange={setShowAlertConfig}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Configurar Alerta de Stock Bajo
            </DialogTitle>
            <DialogDescription>
              Configura el umbral para recibir alertas de stock bajo para {product.desc}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Umbral de alerta (unidades)</Label>
              <Input 
                type="number" 
                defaultValue="20"
                placeholder="Ej: 20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recibirás una alerta cuando el stock esté por debajo de este número
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Frecuencia de notificación</Label>
              <select className="border rounded-md p-2">
                <option>Una sola vez</option>
                <option>Diario</option>
                <option>Semanal</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="email" className="rounded" />
              <Label htmlFor="email">Notificar por email</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAlertConfig(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfigureAlert}>
              Guardar configuración
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default HistoryProductModal;