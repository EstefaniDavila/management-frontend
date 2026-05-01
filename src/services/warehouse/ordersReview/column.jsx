import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const getOrderStatusBadge = (status) => {
    switch (status) {
        case "ENTREGADO":
            return <Badge className="bg-green-500 hover:bg-green-600">● Entregado</Badge>;
        case "PENDIENTE":
            return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">● Pendiente</Badge>;
        case "CANCELADO":
            return <Badge variant="destructive">● Cancelado</Badge>;
        case "EN_TRANSITO":
            return <Badge className="bg-blue-500 hover:bg-blue-600">● En tránsito</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

// MODIFICADO: Solo recibe handleDetails, quitamos edit y delete
const columns = (handleDetails) => [
    {
        accessorKey: 'orderId',
        header: 'Nº PEDIDO',
        cell: info => <span className="font-mono text-xs">{info.getValue()}</span>,
        enableColumnFilter: true,
    },
    {
        accessorKey: 'proveedor',
        header: 'PROVEEDOR',
        cell: info => info.getValue(),
        enableColumnFilter: true,
    },
    {
        accessorKey: 'fechaPedido',
        header: 'FECHA PEDIDO',
        cell: info => new Date(info.getValue()).toLocaleDateString('es-ES'),
        enableColumnFilter: true,
    },
    {
        accessorKey: 'fechaEntrega',
        header: 'FECHA ENTREGA',
        cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString('es-ES') : 'Pendiente',
        enableColumnFilter: true,
    },
    {
        accessorKey: 'totalProductos',
        header: 'TOTAL PRODUCTOS',
        cell: info => `${info.getValue()} unid`,
        enableColumnFilter: true,
    },
    {
        accessorKey: 'montoTotal',
        header: 'MONTO TOTAL',
        cell: info => `$${info.getValue().toLocaleString('es-CL')}`,
        enableColumnFilter: true,
    },
    {
        accessorKey: 'status',
        header: 'ESTADO',
        cell: info => getOrderStatusBadge(info.getValue()),
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
                    className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    title="Ver Detalles"
                    onClick={() => handleDetails(row.original)}
                >
                    <Eye className="h-4 w-4" />
                </Button>
                {/* QUITADOS: botones de Editar y Eliminar */}
            </div>
        ),
    }
];

export default columns;