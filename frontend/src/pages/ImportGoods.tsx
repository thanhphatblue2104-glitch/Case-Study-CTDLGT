import React, { useState } from 'react';
import api from '../api';
import type { Product, Batch } from '../types';
import { inventoryManager } from '../services/InventoryManager';
import { Image as ImageIcon, PackageOpen } from 'lucide-react';

const ImportGoods: React.FC = () => {
    // New Product State
    const [newProductName, setNewProductName] = useState('');
    const [newProductBarcode, setNewProductBarcode] = useState('');
    const [newProductCategory, setNewProductCategory] = useState('');
    const [newProductUnit, setNewProductUnit] = useState('');

    // Common State
    const [quantity, setQuantity] = useState<number>(0);
    const [expirationDate, setExpirationDate] = useState<string>('');
    const [manufacturingDate, setManufacturingDate] = useState<string>('');
    const [supplier, setSupplier] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            let productIdToImport: number;
            let productInfoForDisplay: Product | undefined;

            // 1. Always Create New Product (or get existing if handled by backend)
            const createRes = await api.post('/products', {
                name: newProductName,
                barcode: newProductBarcode,
                category: newProductCategory,
                unit: newProductUnit,
                image: imageUrl // Optional: save base image to product
            });
            const newProduct = createRes.data;
            productIdToImport = newProduct.id;
            productInfoForDisplay = newProduct;

            // 2. Call Backend API to Import Batch
            const response = await api.post('/inventory/import', {
                productId: productIdToImport,
                quantity: Number(quantity),
                expirationDate: new Date(expirationDate).toISOString(),
                manufacturingDate: manufacturingDate ? new Date(manufacturingDate).toISOString() : undefined,
                supplier,
                image: imageUrl
            });

            const newBatch: Batch = response.data;

            // 3. Sync with Frontend Manager (Heap, Map, Queue)
            if (productInfoForDisplay) {
                const batchWithProduct = {
                    ...newBatch,
                    // @ts-ignore
                    product: { ...productInfoForDisplay, image: imageUrl || productInfoForDisplay.image }
                };

                inventoryManager.addBatch(batchWithProduct);

                inventoryManager.addOrder({
                    id: Math.floor(Math.random() * 100000),
                    type: 'IMPORT',
                    productId: productInfoForDisplay.id,
                    quantity: Number(quantity),
                    timestamp: new Date()
                });
            }

            setMessage({ text: `Successfully imported ${quantity} ${productInfoForDisplay?.unit || 'units'} of ${productInfoForDisplay?.name}!`, type: 'success' });

            // Reset Form
            setQuantity(0);
            setExpirationDate('');
            setManufacturingDate('');
            setSupplier('');
            setNewProductName('');
            setNewProductBarcode('');
            setNewProductCategory('');
            setNewProductUnit('');
            setImageUrl('');

        } catch (error: any) {
            setMessage({ text: error.response?.data?.error || 'Import failed', type: 'error' });
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                Import Goods
            </h2>

            {message && (
                <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleImport} className="space-y-6">

                {/* PRODUCT DETAILS */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                            value={newProductName}
                            onChange={e => setNewProductName(e.target.value)}
                            placeholder="e.g. Coca Cola"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Barcode</label>
                            <input
                                type="text"
                                className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                value={newProductBarcode}
                                onChange={e => setNewProductBarcode(e.target.value)}
                                placeholder="893..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
                            <input
                                type="text"
                                className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                value={newProductUnit}
                                onChange={e => setNewProductUnit(e.target.value)}
                                placeholder="Can, Box..."
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4"></div>

                {/* COMMON FIELDS */}
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
                        <input
                            type="number"
                            className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                            min="1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Manufacturing Date</label>
                        <input
                            type="date"
                            className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            value={manufacturingDate}
                            onChange={e => setManufacturingDate(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiration Date</label>
                    <input
                        type="date"
                        className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        value={expirationDate}
                        onChange={e => setExpirationDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Image URL (Optional)</label>
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="url"
                            placeholder="https://example.com/image.png"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                        />
                    </div>
                    {imageUrl && (
                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                            Preview: <img src={imageUrl} alt="Preview" className="w-8 h-8 rounded-md object-cover border border-gray-200" />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Supplier (Optional)</label>
                    <input
                        type="text"
                        className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        value={supplier}
                        onChange={e => setSupplier(e.target.value)}
                    />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    <PackageOpen size={20} />
                    Import Batch
                </button>
            </form>
        </div>
    );
};

export default ImportGoods;
