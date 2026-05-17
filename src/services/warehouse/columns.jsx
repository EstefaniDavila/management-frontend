import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, History, Trash2 } from 'lucide-react';

const getStatusBadge = (status) => {
  switch (status) {
    case "OK":
      return <Badge className="bg-green-500 hover:bg-green-600">● OK</Badge>;
    case "Bajo":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">● Bajo</Badge>;
    case "AGOT":
      return <Badge variant="destructive">● AGOT</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const columns = (handleEdit, handleHistory, handleDelete) => [
  {
    accessorKey: 'id',
    header: 'CÓDIGO',
    cell: info => <span className="font-mono text-xs">{info.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.original.type;

      // MAQUINARIA
      if (type === 'Maquinaria') {
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">
            Maquinaria
          </Badge>
        );
      }

      return (
        <Badge className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 shadow-sm">
          Repuesto
        </Badge>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'NOMBRE DEL PRODUCTO',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'desc',
    header: 'DESCRIPCIÓN',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'stock',
    header: 'STOCK',
    cell: info => `${info.getValue()} unid`,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'loc',
    header: 'UBICACIÓN',
    cell: info => info.getValue(),
    enableColumnFilter: true,
  },
  {
    header: () => <div className="text-center">ACCIONES</div>,
    id: 'actions',
    cell: ({ row }) => (

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-500 hover:bg-blue-50"
          title="Historial"
          onClick={() => handleHistory(row.original)}
        >
          <History className="h-4 w-4" />
        </Button>

      </div>
    ),
  }
];

export default columns;