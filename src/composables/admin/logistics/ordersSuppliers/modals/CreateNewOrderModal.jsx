import React, { useState, useEffect } from 'react';
import Modal from '@/components/custom/modal';
import { Button } from '@/components/custom/button';
import useCrud from '@/hooks/useCrud';
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

const CreateNewOrderModal = ({ open, setOpen, onSave, suppliers, initialSupplierId }) => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        supplier_id: '',
        requested_by_id: user?.id || '',
        expected_date: '',
        notes: '',
        purchase_order_items_attributes: [
            { ui_id: Date.now(), product_id: '', product_nombre: '', quantity: 1, unit_cost: 0, subtotal: 0 }
        ]
    });

    const [supplierProducts, setSupplierProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    useEffect(() => {
        if (user?.id) {
            setFormData(prev => ({
                ...prev,
                requested_by_id: user.id
            }));
        }
    }, [user?.id]);

    useEffect(() => {
        if (initialSupplierId && open) {
            setFormData(prev => ({
                ...prev,
                supplier_id: initialSupplierId.toString()
            }));
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
            setSupplierProducts([]);
        }
    }, [initialSupplierId, open, user?.id]);

    useEffect(() => {
        const fetchSupplierProducts = async () => {
            if (!formData.supplier_id) {
                setSupplierProducts([]);
                return;
            }

            setLoadingProducts(true);
            try {
                const response = await fetch(`/api/v1/admin/suppliers/${formData.supplier_id}/supplier_products`);
                const data = await response.json();
                const mappedProducts = data.map(sp => ({
                    id: sp.product.id,
                    name: sp.product.name,
                    code: sp.product.code,
                    base_price: parseFloat(sp.unit_cost),
                    supplier_code: sp.supplier_code,
                    supplier_product_id: sp.id
                }));

                setSupplierProducts(mappedProducts);

                setFormData(prev => ({
                    ...prev,
                    purchase_order_items_attributes: [
                        { ui_id: Date.now(), product_id: '', product_nombre: '', quantity: 1, unit_cost: 0, subtotal: 0 }
                    ]
                }));
            } catch (error) {
                console.error("Error fetching supplier products:", error);
                setSupplierProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchSupplierProducts();
    }, [formData.supplier_id]);
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleProductChange = (index, field, value) => {
        const newItems = [...formData.purchase_order_items_attributes];
        newItems[index][field] = value;

        if (field === 'quantity' || field === 'unit_cost') {
            const quantity = field === 'quantity' ? parseFloat(value) : newItems[index].quantity;
            const unit_cost = field === 'unit_cost' ? parseFloat(value) : newItems[index].unit_cost;
            newItems[index].subtotal = (quantity || 0) * (unit_cost || 0);
        }

        setFormData(prev => ({
            ...prev,
            purchase_order_items_attributes: newItems
        }));
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
        setFormData(prev => ({
            ...prev,
            purchase_order_items_attributes: newItems
        }));
    };

    const selectProduct = (index, product_id, product_nombre, unit_cost) => {
        const newItems = [...formData.purchase_order_items_attributes];
        newItems[index].product_id = product_id;
        newItems[index].product_nombre = product_nombre;
        newItems[index].unit_cost = unit_cost;
        newItems[index].subtotal = newItems[index].quantity * unit_cost;
        setFormData(prev => ({
            ...prev,
            purchase_order_items_attributes: newItems
        }));
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

        const cleanedItemsAttributes = formData.purchase_order_items_attributes.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_cost: parseFloat(item.unit_cost)
        }));

        const payload = new FormData();
        payload.append('supplier_id', formData.supplier_id);
        if (formData.requested_by_id) payload.append('requested_by_id', formData.requested_by_id);
        if (formData.expected_date) payload.append('expected_date', formData.expected_date);
        if (formData.notes) payload.append('notes', formData.notes);

        cleanedItemsAttributes.forEach((item, index) => {
            payload.append(`purchase_order_items_attributes[${index}][product_id]`, item.product_id);
            payload.append(`purchase_order_items_attributes[${index}][quantity]`, item.quantity);
            payload.append(`purchase_order_items_attributes[${index}][unit_cost]`, item.unit_cost);
        });

        await onSave(payload);

        setFormData({
            supplier_id: initialSupplierId ? initialSupplierId.toString() : '',
            requested_by_id: user?.id || '',
            expected_date: '',
            notes: '',
            purchase_order_items_attributes: [
                { ui_id: Date.now(), product_id: '', product_nombre: '', quantity: 1, unit_cost: 0, subtotal: 0 }
            ]
        });
        setSupplierProducts([]);
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
                            placeholder="Ingrese notas para el pedido (Ej: Pedido mensual de reposición)"
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
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addProduct}
                            className="gap-1"
                            disabled={!formData.supplier_id || supplierProducts.length === 0}
                        >
                            <Plus className="h-4 w-4" />
                            Agregar Producto
                        </Button>
                    </div>
                    {formData.supplier_id && supplierProducts.length === 0 && !loadingProducts && (
                        <div className="text-center p-4 bg-yellow-50 text-yellow-600 rounded-lg text-sm">
                            Este proveedor no tiene productos registrados en el catálogo.
                        </div>
                    )}

                    {loadingProducts && (
                        <div className="text-center p-4 text-muted-foreground">
                            Cargando productos del proveedor...
                        </div>
                    )}

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
                                                        const selected = supplierProducts.find(p => p.id === value);
                                                        if (selected) {
                                                            selectProduct(index, selected.id, selected.name, selected.base_price);
                                                        }
                                                    }}
                                                    disabled={!formData.supplier_id || supplierProducts.length === 0}
                                                >
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue placeholder="Seleccionar producto" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {supplierProducts.map((prod) => (
                                                            <SelectItem key={prod.id} value={prod.id}>
                                                                {prod.name} - ${prod.base_price.toFixed(2)}
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
                                                    disabled={!item.product_id}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.unit_cost}
                                                    readOnly
                                                    className="h-8 text-right bg-muted"

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

export default CreateNewOrderModal;