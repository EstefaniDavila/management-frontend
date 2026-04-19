import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, ShoppingCart } from 'lucide-react';

const getStatusBadge = (status) => {
  switch (status) {
    case "Activo":
      return <Badge className="bg-green-500 hover:bg-green-600">● Activo</Badge>;
    case "Inactivo":
      return <Badge variant="destructive">● Inactivo</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const columns = (handleEdit, handleDelete, handleViewDetails, handleCreateOrder) => [
  {
    accessorKey: 'codigo',
    header: 'CÓDIGO',
    cell: info => <span className="font-mono text-xs font-semibold">{info.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'nombre',
    header: 'NOMBRE / RAZÓN SOCIAL',
    cell: info => <span className="font-medium">{info.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'ruc',
    header: 'RUC',
    cell: info => <span className="font-mono text-sm">{info.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'contacto',
    header: 'CONTACTO',
    cell: info => info.getValue() || '—',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'telefono',
    header: 'TELÉFONO',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    cell: info => <a href={`mailto:${info.getValue()}`} className="text-blue-600 hover:underline">{info.getValue()}</a>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'status',
    header: 'ESTADO',
    cell: info => getStatusBadge(info.getValue()),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'acciones',
    header: () => <div className="text-center">ACCIONES</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
          title="Realizar Pedido"
          onClick={() => handleCreateOrder(row.original)}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          title="Ver Detalles"
          onClick={() => handleViewDetails(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
          title="Editar"
          onClick={() => handleEdit(row.original)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          title="Eliminar"
          onClick={() => handleDelete(row.original.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
    size: 180,
  }
];

export default columns;