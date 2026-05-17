import React, { useState, useEffect } from 'react';
import Modal from '@/components/custom/modal';
import { Button } from '@/components/custom/button';
import useCrud from '@/hooks/useCrud';
import useEntityMutation from '@/hooks/useEntityMutation';
import { useAuth } from '@/providers/UserContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

const CreateNewOrderModalLogistic = ({ open, setOpen, onSave, suppliers, initialSupplierId }) => {
    const { user } = useAuth();

    // Usar useEntityMutation para purchase_orders
    const { mutateAsync: createPurchaseOrder } = useEntityMutation({
        entityName: 'purchase_orders'
    });

    const [formData, setFormData] = useState({
        supplier_id: '',
        requested_by_id: user?.id || '',
        expected_date: '',
        notes: '',
        purchase_order_items_attributes: [
            { ui_id: Date.now(), product_id: '', product_nombre: '', quantity: 1, unit_cost: 0, subtotal: 0 }
        ]
    });

    // Resto del código (useEffects, handlers) se mantiene igual...
    useEffect(() => {
        if (user?.id) {
            setFormData(prev => ({ ...prev, requested_by_id: user.id }));
        }
    }, [user?.id]);

    useEffect(() => {
        if (initialSupplierId && open) {
            setFormData(prev => ({ ...prev, supplier_id: initialSupplierId.toString() }));
        } else if (!open) {
            setFormData({
                supplier_id: '',
                requested_by_id: user?.id || '',
                expected_date: '',
                notes: '',
                purchase_order_items_attributes: [
                    { ui_id: Date.now(), product_id: '', product_nombre: '', quantity: 1, unit_cost: 0, subtotal: 0 }
                ]
            });
        }
    }, [initialSupplierId, open, user?.id]);

    const [productos, setProductos] = useState([]);
    const { getModel } = useCrud('/api/v1/logistic_user/products');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getModel();
                const productsArray = response.data || (Array.isArray(response) ? response : []);
                setProductos(productsArray);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleProductChange = (index, field, value) => {
        const newItems = [...formData.purchase_order_items_attributes];
        newItems[index][field] = value;

        if (field === 'quantity' || field === 'unit_cost') {
            const quantity = field === 'quantity' ? parseFloat(value) : newItems[index].quantity;
            const unit_cost = field === 'unit_cost' ? parseFloat(value) : newItems[index].unit_cost;
            newItems[index].subtotal = (quantity || 0) * (unit_cost || 0);
        }

        setFormData(prev => ({ ...prev, purchase_order_items_attributes: newItems }));
    };

    const addProduct = () => {
        setFormData(prev => ({
            ...prev,
            purchase_order_items_attributes: [
                ...prev.purchase_order_items_attributes,
                { ui_id: Date.now(), product_id: '', product_nombre: '', quantity: 1, unit_cost: 0, subtotal: 0 }
            ]
        }));
    };

    const removeProduct = (index) => {
        if (formData.purchase_order_items_attributes.length === 1) return;
        const newItems = formData.purchase_order_items_attributes.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, purchase_order_items_attributes: newItems }));
    };

    const selectProduct = (index, product_id, product_nombre, unit_cost) => {
        const newItems = [...formData.purchase_order_items_attributes];
        newItems[index].product_id = product_id;
        newItems[index].product_nombre = product_nombre;
        newItems[index].unit_cost = unit_cost;
        newItems[index].subtotal = newItems[index].quantity * unit_cost;
        setFormData(prev => ({ ...prev, purchase_order_items_attributes: newItems }));
    };

    const calcularTotal = () => {
        return formData.purchase_order_items_attributes.reduce((sum, item) => sum + item.subtotal, 0);
    };

    const handleSubmit = async () => {
        if (!formData.supplier_id) {
            alert('Por favor seleccione un proveedor');
            return;
        }

        if (formData.purchase_order_items_attributes.some(p => !p.product_id || p.quantity < 1)) {
            alert('Por favor complete todos los productos seleccionados');
            return;
        }

        // Preparar los items en el formato correcto
        const cleanedItemsAttributes = formData.purchase_order_items_attributes.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_cost: parseFloat(item.unit_cost)
        }));

        // Crear el objeto con el formato que espera el backend
        const payload = {
            supplier_id: formData.supplier_id,
            requested_by_id: formData.requested_by_id,
            expected_date: formData.expected_date,
            notes: formData.notes,
            purchase_order_items_attributes: cleanedItemsAttributes
        };

        try {
            // Usar useEntityMutation para crear
            const response = await createPurchaseOrder({
                action: "create",
                entity: purchaseOrderData, // ← El objeto que quieres crear
                endpoint: '/api/v1/logistic_user/purchase_orders'
            });

            console.log("Pedido creado:", response);

            if (onSave) {
                await onSave(payload);
            }

            // Resetear formulario
            setFormData({
                supplier_id: initialSupplierId ? initialSupplierId.toString() : '',
                requested_by_id: user?.id || '',
                expected_date: '',
                notes: '',
                purchase_order_items_attributes: [
                    { ui_id: Date.now(), product_id: '', product_nombre: '', quantity: 1, unit_cost: 0, subtotal: 0 }
                ]
            });

        } catch (error) {
            console.error("Error al crear pedido:", error);
            // El toast ya se maneja en useEntityMutation
        }
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
            {/* Resto del JSX se mantiene igual */}
            <div className="flex flex-col gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="supplier_id">Proveedor *</Label>
                        <Select value={formData.supplier_id} onValueChange={(value) => handleInputChange('supplier_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un proveedor" />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers?.map((supplier) => (
                                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                        {supplier.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Fecha Estimada de Entrega *</Label>
                        <Input
                            type="date"
                            value={formData.expected_date}
                            onChange={(e) => handleInputChange('expected_date', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label>Notas</Label>
                        <Textarea
                            placeholder="Ingrese notas para el pedido"
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            className="resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label>Productos *</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addProduct} className="gap-1">
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
                                    {formData.purchase_order_items_attributes.map((item, index) => (
                                        <TableRow key={item.ui_id}>
                                            <TableCell>
                                                <Select
                                                    value={item.product_id}
                                                    onValueChange={(value) => {
                                                        const selected = productos.find(p => p.id === value);
                                                        if (selected) {
                                                            selectProduct(index, selected.id, selected.name, selected.base_price ? parseFloat(selected.base_price) : 0);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue placeholder="Seleccionar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {productos.map((prod) => (
                                                            <SelectItem key={prod.id} value={prod.id}>
                                                                {prod.name} - ${parseFloat(prod.base_price || 0).toFixed(2)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                                    className="h-8 text-center"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.unit_cost}
                                                    onChange={(e) => handleProductChange(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                                                    className="h-8 text-right"
                                                />
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                ${item.subtotal.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500"
                                                    onClick={() => removeProduct(index)}
                                                    disabled={formData.purchase_order_items_attributes.length === 1}
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

                    <div className="flex justify-end p-4 bg-muted/30 rounded-lg">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total del Pedido</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                ${calcularTotal().toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreateNewOrderModalLogistic;