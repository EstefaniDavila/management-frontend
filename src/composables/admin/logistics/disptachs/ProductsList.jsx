import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, CheckCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import useCrud from '@/hooks/useCrud';
import useEntityMutation from '@/hooks/useEntityMutation';

const ProductsList = ({
    items = [],
    title = "Productos a Despachar",
    dispatchOrderId,
    onItemsChange
}) => {
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [localItems, setLocalItems] = useState(items);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    const { getModel } = useCrud('/api/v1/admin/products?active=true');
    const itemMutation = useEntityMutation({ entityName: 'dispatch_item' });

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const response = await getModel();
                const products = response?.data || [];
                setAvailableProducts(products);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const addProduct = async () => {
        if (!selectedProductId || !dispatchOrderId) return;

        setIsAdding(true);
        try {
            const product = availableProducts.find(p => p.id === selectedProductId);

            const newItem = await itemMutation.mutateAsync({
                action: 'create',
                endpoint: '/api/v1/admin/dispatch_items',
                entity: {
                    quantity: quantity,
                    checked: false,
                    dispatch_order_id: dispatchOrderId,
                    product_id: selectedProductId
                }
            });

            if (newItem) {
                const updatedItems = [...localItems, { ...newItem, product }];
                setLocalItems(updatedItems);
                onItemsChange?.(updatedItems);
                setSelectedProductId('');
                setQuantity(1);
            }
        } catch (error) {
            console.error('Error al agregar:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await itemMutation.mutateAsync({
                action: 'delete',
                endpoint: `/api/v1/admin/dispatch_items/${itemId}`
            });
            const updatedItems = localItems.filter(item => item.id !== itemId);
            setLocalItems(updatedItems);
            onItemsChange?.(updatedItems);
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    const toggleCheck = async (item) => {
        try {
            const updatedItem = await itemMutation.mutateAsync({
                action: 'update',
                endpoint: `/api/v1/admin/dispatch_items/${item.id}`,
                entity: {
                    checked: !item.checked
                }
            });

            if (updatedItem) {
                const updatedItems = localItems.map(i =>
                    i.id === item.id ? { ...i, checked: updatedItem.checked } : i
                );
                setLocalItems(updatedItems);
                onItemsChange?.(updatedItems);
            }
        } catch (error) {
            console.error('Error al verificar:', error);
        }
    };

    const hasItems = localItems.length > 0;
    const allChecked = hasItems && localItems.every(item => item.checked);

    if (loading) {
        return <div className="text-center py-4">Cargando productos...</div>;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <Label className="text-sm font-semibold">{title}</Label>
                    {hasItems && <Badge>{localItems.length} items</Badge>}
                </div>
                {allChecked && <Badge className="bg-green-500">✓ Todos verificados</Badge>}
            </div>

            <div className="flex gap-2">
                <select
                    className="flex-1 border rounded-md p-2 text-sm bg-background text-foreground dark:bg-slate-900"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                >
                    <option value="">-- Seleccionar producto --</option>
                    {availableProducts.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.product_type === 'vehicle' ? '🚗 Vehículo' : '🔧 Repuesto'} - {p.name}
                        </option>
                    ))}
                </select>

                <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-20"
                />

                <Button onClick={addProduct} disabled={!selectedProductId || isAdding || !dispatchOrderId} size="sm">
                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Agregar
                </Button>
            </div>

            {hasItems ? (
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                    {localItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 border rounded bg-card text-card-foreground">
                            <div>
                                <p className="text-sm font-medium">{item.product?.name}</p>
                                <p className="text-xs text-gray-500">Código: {item.product?.code}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-semibold">x{item.quantity}</span>

                                <Button
                                    variant={item.checked ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleCheck(item)}
                                    className={`h-8 ${item.checked ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                                >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    {item.checked ? "Verificado" : "Verificar"}
                                </Button>

                                {!item.checked && (
                                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-red-500 h-8 w-8 p-0">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-4 text-gray-500 text-sm border rounded">
                    No hay productos. Selecciona uno arriba.
                </div>
            )}
        </div>
    );
};

export default ProductsList;