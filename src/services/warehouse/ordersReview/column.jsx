import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

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

const columns = (handleDetails, handleConfirmReception) => [
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
        header: 'FECHA DE RECEPCIÓN',
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
        accessorKey: 'status',
        header: 'ESTADO',
        cell: info => getOrderStatusBadge(info.getValue()),
        enableColumnFilter: true,
    },
    {
        accessorKey: 'conforme',
        header: 'RECEPCIÓN',
        cell: ({ row }) => {
            const conforme = row.original.conforme;
            if (conforme === true) {
                return <Badge className="bg-green-100 text-green-800">✓ Conforme</Badge>;
            }
            if (conforme === false) {
                return <Badge variant="destructive">✗ No conforme</Badge>;
            }
            return <Badge variant="outline">⏳ Pendiente</Badge>;
        },
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
                    title="Ver Detalles del Pedido"
                    onClick={() => handleDetails(row.original)}
                >
                    <Eye className="h-4 w-4" />
                </Button>

                {row.original.status === "ENTREGADO" && row.original.conforme === undefined && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
                            title="Confirmar Recepción Conforme"
                            onClick={() => handleConfirmReception(row.original, true)}
                        >
                            <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            title="Marcar como No Conforme"
                            onClick={() => handleConfirmReception(row.original, false)}
                        >
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>
        ),
    }
];

export default columns;