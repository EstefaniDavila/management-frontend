import React, { useState } from 'react';
import Modal from '@/components/custom/modal';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';

const CreateNewOrderModal = ({ open, setOpen, onSave, suppliers }) => {
    const [formData, setFormData] = useState({
        proveedor: '',
        fechaPedido: new Date().toISOString().split('T')[0],
        fechaEntregaEstimada: '',
        metodoPago: 'transferencia',
        productos: [
            { id: Date.now(), nombre: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }
        ]
    });

    const productosMock = [
        { id: 1, nombre: "Filtro de aceite", precio: 45000 },
        { id: 2, nombre: "Batería 12V", precio: 120000 },
        { id: 3, nombre: "Correa de distribución", precio: 35000 },
        { id: 4, nombre: "Bujías (paquete x4)", precio: 25000 },
        { id: 5, nombre: "Aceite de motor 5L", precio: 68000 },
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleProductChange = (index, field, value) => {
        const newProductos = [...formData.productos];
        newProductos[index][field] = value;

        if (field === 'cantidad' || field === 'precioUnitario') {
            const cantidad = field === 'cantidad' ? parseFloat(value) : newProductos[index].cantidad;
            const precioUnitario = field === 'precioUnitario' ? parseFloat(value) : newProductos[index].precioUnitario;
            newProductos[index].subtotal = (cantidad || 0) * (precioUnitario || 0);
        }

        setFormData(prev => ({
            ...prev,
            productos: newProductos
        }));
    };

    const addProduct = () => {
        setFormData(prev => ({
            ...prev,
            productos: [
                ...prev.productos,
                { id: Date.now(), nombre: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }
            ]
        }));
    };

    const removeProduct = (index) => {
        if (formData.productos.length === 1) return;
        const newProductos = formData.productos.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            productos: newProductos
        }));
    };

    const selectProduct = (index, productNombre, productPrecio) => {
        const newProductos = [...formData.productos];
        newProductos[index].nombre = productNombre;
        newProductos[index].precioUnitario = productPrecio;
        newProductos[index].subtotal = newProductos[index].cantidad * productPrecio;
        setFormData(prev => ({
            ...prev,
            productos: newProductos
        }));
    };

    const calcularTotal = () => {
        return formData.productos.reduce((sum, prod) => sum + prod.subtotal, 0);
    };

    const handleSubmit = async () => {
        if (!formData.proveedor) {
            alert('Por favor seleccione un proveedor');
            return;
        }

        if (formData.productos.some(p => !p.nombre || p.cantidad < 1)) {
            alert('Por favor complete todos los productos');
            return;
        }

        const pedidoData = {
            orderId: `PO-${Date.now()}`,
            proveedor: formData.proveedor,
            fechaPedido: formData.fechaPedido,
            fechaEntrega: formData.fechaEntregaEstimada || null,
            totalProductos: formData.productos.reduce((sum, p) => sum + p.cantidad, 0),
            montoTotal: calcularTotal(),
            status: "PENDIENTE",
            productos: formData.productos
        };

        await onSave(pedidoData);
        setFormData({
            proveedor: '',
            fechaPedido: new Date().toISOString().split('T')[0],
            fechaEntregaEstimada: '',
            metodoPago: 'transferencia',
            productos: [{ id: Date.now(), nombre: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }]
        });
    };

    return (
        <Modal
            open={open}
            setOpen={setOpen}
            title="Crear Nuevo Pedido a Proveedor"
            description="Complete los detalles del pedido para enviar al proveedor"
            size="lg"
            callBack={handleSubmit}
        >
            <div className="flex flex-col gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">

                {/* Información del Pedido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="proveedor">Proveedor *</Label>
                        <Select onValueChange={(value) => handleInputChange('proveedor', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un proveedor" />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers?.map((supplier) => (
                                    <SelectItem key={supplier.id} value={supplier.nombre}>
                                        {supplier.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Método de Pago</Label>
                        <Select
                            value={formData.metodoPago}
                            onValueChange={(value) => handleInputChange('metodoPago', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                                <SelectItem value="cheque">Cheque</SelectItem>
                                <SelectItem value="efectivo">Efectivo</SelectItem>
                                <SelectItem value="credito">Crédito 30 días</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Fecha de Pedido *</Label>
                        <Input
                            type="date"
                            value={formData.fechaPedido}
                            onChange={(e) => handleInputChange('fechaPedido', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Fecha Estimada de Entrega</Label>
                        <Input
                            type="date"
                            value={formData.fechaEntregaEstimada}
                            onChange={(e) => handleInputChange('fechaEntregaEstimada', e.target.value)}
                        />
                    </div>
                </div>

                {/* Productos */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label>Productos *</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addProduct}
                            className="gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            Agregar Producto
                        </Button>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Producto</TableHead>
                                        <TableHead className="w-[15%] text-center">Cantidad</TableHead>
                                        <TableHead className="w-[20%] text-right">Precio Unit.</TableHead>
                                        <TableHead className="w-[15%] text-right">Subtotal</TableHead>
                                        <TableHead className="w-[10%] text-center">Acción</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {formData.productos.map((producto, index) => (
                                        <TableRow key={producto.id}>
                                            <TableCell>
                                                <Select
                                                    onValueChange={(value) => {
                                                        const selected = productosMock.find(p => p.nombre === value);
                                                        if (selected) {
                                                            selectProduct(index, selected.nombre, selected.precio);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue placeholder="Seleccionar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {productosMock.map((prod) => (
                                                            <SelectItem key={prod.id} value={prod.nombre}>
                                                                {prod.nombre} - ${prod.precio.toLocaleString()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {producto.nombre && (
                                                    <Input
                                                        type="text"
                                                        value={producto.nombre}
                                                        onChange={(e) => handleProductChange(index, 'nombre', e.target.value)}
                                                        className="mt-1 text-xs"
                                                        placeholder="Nombre producto"
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={producto.cantidad}
                                                    onChange={(e) => handleProductChange(index, 'cantidad', parseInt(e.target.value) || 0)}
                                                    className="h-8 text-center"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="1000"
                                                    value={producto.precioUnitario}
                                                    onChange={(e) => handleProductChange(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
                                                    className="h-8 text-right"
                                                />
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                ${producto.subtotal.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500"
                                                    onClick={() => removeProduct(index)}
                                                    disabled={formData.productos.length === 1}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-end p-4 bg-muted/30 rounded-lg">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total del Pedido</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                ${calcularTotal().toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreateNewOrderModal;