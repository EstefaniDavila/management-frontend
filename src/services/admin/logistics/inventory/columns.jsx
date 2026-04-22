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
    accessorKey: 'status',
    header: 'ESTADO',
    cell: info => getStatusBadge(info.getValue()),
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
          className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
          title="Editar"
          onClick={() => handleEdit(row.original)}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-500 hover:bg-blue-50"
          title="Historial"
          onClick={() => handleHistory(row.original)}
        >
          <History className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:bg-red-50"
          title="Eliminar"
          onClick={() => handleDelete(row.original)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }
];

export default columns;