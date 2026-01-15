import React, { useState, useEffect } from 'react';
import api from '../api';
import type { Product } from '../types';

const ImportGoods: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(0);
    const [expirationDate, setExpirationDate] = useState<string>('');
    const [supplier, setSupplier] = useState<string>('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data)).catch(console.error);
    }, []);

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/inventory/import', {
                productId: Number(selectedProduct),
                quantity: Number(quantity),
                expirationDate: new Date(expirationDate).toISOString(),
                supplier
            });
            setMessage({ text: 'Import successful!', type: 'success' });
            setQuantity(0);
            setExpirationDate('');
            setSupplier('');
        } catch (error: any) {
            setMessage({ text: error.response?.data?.error || 'Import failed', type: 'error' });
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Import Goods</h2>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleImport}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Select Product</label>
                    <select
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                        value={selectedProduct}
                        onChange={e => setSelectedProduct(e.target.value)}
                        required
                    >
                        <option value="">-- Select Product --</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.barcode})</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Quantity</label>
                    <input
                        type="number"
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                        value={quantity}
                        onChange={e => setQuantity(Number(e.target.value))}
                        min="1"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Expiration Date</label>
                    <input
                        type="date"
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                        value={expirationDate}
                        onChange={e => setExpirationDate(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Supplier (Optional)</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                        value={supplier}
                        onChange={e => setSupplier(e.target.value)}
                    />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Import Batch
                </button>
            </form>
        </div>
    );
};

export default ImportGoods;
