import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, History, Trash2 } from 'lucide-react';

const getVehicleStatusBadge = (status) => {
  switch (status) {
    case 'available':
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white">
          Disponible
        </Badge>
      );

    case 'disabled':
      return (
        <Badge className="bg-red-500 hover:bg-red-600 text-white">
          Inactivo
        </Badge>
      );

    case 'rented':
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
          Rentado
        </Badge>
      );

    case 'sold':
      return (
        <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
          Vendido
        </Badge>
      );

    case 'maintenance':
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
          Mantenimiento
        </Badge>
      );

    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getInventoryBadge = (status) => {
  switch (status) {
    case 'OK':
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          ● OK
        </Badge>
      );

    case 'Bajo':
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">
          ● Bajo
        </Badge>
      );

    case 'AGOT':
      return (
        <Badge variant="destructive">
          ● AGOT
        </Badge>
      );

    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStateBadge = (state) => {
  switch (state) {
    case 'ACTIVO':
      return (
        <Badge className="bg-emerald-500 hover:bg-emerald-600">
          ACTIVO
        </Badge>
      );

    case 'INACTIVO':
      return (
        <Badge className="bg-red-600 hover:bg-red-700 text-white font-medium">
          INACTIVO
        </Badge>
      );

    default:
      return <Badge variant="outline">{state}</Badge>;
  }
};


const columns = (handleEdit, handleHistory, handleDelete) => [
  {
    accessorKey: 'id',
    header: 'CÓDIGO',
    cell: info => (
      <span className="font-mono text-xs">
        {info.getValue()}
      </span>
    ),
  },

  {
    accessorKey: 'name',
    header: 'NOMBRE DEL PRODUCTO',
    cell: info => info.getValue(),
  },

  {
    accessorKey: 'type',
    header: 'TIPO',

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
    accessorKey: 'inventoryValue',
    header: 'STOCK',
    cell: ({ row }) => {
      const value = row.original.inventoryValue;
      const productType = row.original.product_type;

      // VEHÍCULOS
      if (productType === 'vehicle') {
        return getVehicleStatusBadge(value);
      }

      // REPUESTOS
      return (
        <span className="font-medium">
          {value} unid
        </span>
      );
    },
  },

  {
    accessorKey: 'secondaryValue',
    header: 'MIN',
    cell: ({ row }) => {
      const value = row.original.secondaryValue;
      const productType = row.original.product_type;

      if (productType === 'vehicle') {
        return (
          <span className="text-sm">
            {value} hrs
          </span>
        );
      }

      return (
        <span className="text-sm">
          {value}
        </span>
      );
    },
  },

  {
    accessorKey: 'locationValue',
    header: 'UBICACIÓN',
    cell: info => info.getValue(),
  },

  {
    accessorKey: 'state',
    header: 'ESTADO',
    cell: info => getStateBadge(info.getValue()),
  },

  {
    accessorKey: 'base_price',
    header: 'PRECIO BASE',
    cell: info => (
      <span className="font-medium">
        {info.getValue()}
      </span>
    ),
  },

  {
    header: () => (
      <div className="text-center">
        ACCIONES
      </div>
    ),

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
  },
];

export default columns;