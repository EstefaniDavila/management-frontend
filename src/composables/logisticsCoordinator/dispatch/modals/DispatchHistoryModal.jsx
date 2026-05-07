import React, { useState } from 'react';
import Modal from '@/components/custom/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Truck,
  Calendar,
  MapPin,
  User,
  Package,
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const DispatchHistoryModal = ({ open, setOpen, history }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');

  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.guia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.conductor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === 'todos' || item.estado === filterEstado;
    
    return matchesSearch && matchesEstado;
  });

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Entregado':
        return <Badge className="bg-green-500">Entregado</Badge>;
      case 'En Tránsito':
        return <Badge className="bg-blue-500">En Tránsito</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <span className="text-sm sm:text-base">Historial de Despachos</span>
        </div>
      }
      description={`Total de despachos: ${history.length}`}
      size="xl"
      callBack={null}
    >
      <div className="flex flex-col gap-4 py-2 h-full max-h-[70vh] overflow-y-auto">

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por guía, cliente o conductor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={filterEstado === 'todos' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilterEstado('todos')}
              className="text-xs"
            >
              Todos
            </Button>
            <Button 
              variant={filterEstado === 'En Tránsito' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilterEstado('En Tránsito')}
              className="text-xs"
            >
              En Tránsito
            </Button>
            <Button 
              variant={filterEstado === 'Entregado' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilterEstado('Entregado')}
              className="text-xs"
            >
              Entregados
            </Button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-xl">
            <Truck className="h-10 w-10 mx-auto text-muted-foreground opacity-20" />
            <p className="text-sm text-muted-foreground mt-2">No se encontraron despachos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div 
                key={item.id} 
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">{item.guia}</span>
                    {getStatusBadge(item.estado)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {item.fecha}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Cliente</p>
                      <p className="text-xs font-medium">{item.cliente}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Dirección</p>
                      <p className="text-xs">{item.direccion}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Truck className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Vehículo</p>
                      <p className="text-xs font-mono">{item.vehiculo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Conductor</p>
                      <p className="text-xs">{item.conductor}</p>
                    </div>
                  </div>
                </div>

                {item.observaciones && (
                  <div className="mt-3 p-2 bg-muted/30 rounded-md">
                    <p className="text-[10px] text-muted-foreground">Observaciones:</p>
                    <p className="text-xs">{item.observaciones}</p>
                  </div>
                )}

                <div className="mt-3 pt-2 border-t text-right">
                  <p className="text-[10px] text-muted-foreground">
                    Orden asociada: #{item.ordenId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DispatchHistoryModal;