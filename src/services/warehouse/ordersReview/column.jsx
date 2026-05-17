import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, XCircle, Download as DownloadIcon } from 'lucide-react';

const getOrderStatusBadge = (status) => {
    switch (status) {
        case "completed":
            return <Badge className="bg-green-500 hover:bg-green-600">● Completado</Badge>;
        case "draft":
            return <Badge className="bg-amber-500 hover:bg-amber-600 text-black">● Pendiente</Badge>;
        case "sent":
            return <Badge className="bg-blue-500 hover:bg-blue-600">● Enviado</Badge>;
        case "partially_received":
            return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">● Recibido Parcial</Badge>;
        case "cancelled":
            return <Badge variant="destructive">● Cancelado</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

const columns = (handleDetails, handleReceive, handleCancel, handleDownloadGuide) => [
    {
        accessorKey: 'orderId',
        header: 'Nº PEDIDO',
        cell: info => <span className="font-mono text-xs">{info.getValue()}</span>,
        enableColumnFilter: true,
    },
    {
        accessorKey: 'proveedor',
        header: 'PROVEEDOR',
        cell: info => info.getValue() || 'N/A',
        enableColumnFilter: true,
    },
    {
        accessorKey: 'notas',
        header: 'NOTA',
        cell: info => `${info.getValue()} unid`,
        enableColumnFilter: true,
    },
    {
        accessorKey: 'fechaPedido',
        header: 'FECHA PEDIDO',
        cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString('es-ES') : 'N/A',
        enableColumnFilter: true,
    },
    {
        accessorKey: 'fechaEntrega',
        header: 'FECHA DE RECEPCIÓN',
        cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString('es-ES') : 'Pendiente',
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
                    title="Ver Detalles del Pedido"
                    onClick={() => handleDetails(row.original)}
                >
                    <Eye className="h-4 w-4" />
                </Button>

                {(row.original.status === "draft" || row.original.status === "sent" || row.original.status === "partially_received") && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
                        title="Marcar Recibido"
                        onClick={() => handleReceive(row.original)}
                    >
                        <CheckCircle className="h-4 w-4" />
                    </Button>
                )}

                {(row.original.status === "draft" || row.original.status === "sent") && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        title="Cancelar Orden"
                        onClick={() => handleCancel(row.original)}
                    >
                        <XCircle className="h-4 w-4" />
                    </Button>


                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-orange-500 hover:bg-orange-50"
                    title="Descargar Pedido"
                    onClick={() => handleDownloadGuide(row.original)}
                >
                    <DownloadIcon className="h-4 w-4" />
                </Button>
            </div>
        ),
    }
];

export default columns;