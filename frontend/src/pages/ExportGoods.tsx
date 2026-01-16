import React, { useState, useEffect } from 'react';
import api from '../api';
import type { Product } from '../types';
import { inventoryManager } from '../services/InventoryManager';

const ExportGoods: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(0);
    const [customerId, setCustomerId] = useState<string>('');
    const [queuePosition, setQueuePosition] = useState<number | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [processing, setProcessing] = useState(false);
    const [processLogs, setProcessLogs] = useState<any[]>([]);

    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data)).catch(console.error);
    }, []);

    const handleRequestExport = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/inventory/export-request', {
                productId: Number(selectedProduct),
                quantity: Number(quantity),
                customerId
            });
            setMessage({ text: 'Request added to Queue!', type: 'success' });
            setQueuePosition(res.data.position);

            // Sync with Manager History
            inventoryManager.addOrder({
                id: Math.floor(Math.random() * 100000),
                type: 'EXPORT',
                productId: Number(selectedProduct),
                quantity: Number(quantity),
                timestamp: new Date()
            });

            setQuantity(0);
        } catch (error: any) {
            setMessage({ text: error.response?.data?.error || 'Request failed', type: 'error' });
        }
    };

    const handleProcessQueue = async () => {
        setProcessing(true);
        try {
            const res = await api.post('/inventory/process-queue');
            setProcessLogs(res.data);
            setQueuePosition(null); // Reset queue position display as queue is processed
            if (res.data.length === 0) {
                setMessage({ text: 'Queue is empty', type: 'success' });
            } else {
                setMessage({ text: `Processed ${res.data.length} requests`, type: 'success' });
            }
        } catch (error: any) {
            setMessage({ text: 'Failed to process queue', type: 'error' });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Request Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hidden-scrollbar">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Request Export</h2>
                {message && (
                    <div className={`p-4 mb-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleRequestExport} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Product</label>
                        <select
                            className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                            value={selectedProduct}
                            onChange={e => setSelectedProduct(e.target.value)}
                            required
                        >
                            <option value="">-- Select Product --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (Stock available)</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
                        <input
                            type="number"
                            className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                            min="1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer ID (Optional)</label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                            value={customerId}
                            onChange={e => setCustomerId(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
                        Add to Export Queue
                    </button>
                </form>

                {queuePosition !== null && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm font-medium">
                        Current Queue Size: <strong>{queuePosition}</strong>
                    </div>
                )}
            </div>

            {/* Queue Management */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Queue Management</h2>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                    The system uses a <strong>Min-Heap Algorithm</strong> to automatically prioritize batches. When you process the queue, it will intelligently pick the <strong>Oldest (First-In) Batches</strong> or those created first to ensure inventory freshness (FIFO/FEFO).
                </p>

                <button
                    onClick={handleProcessQueue}
                    disabled={processing}
                    className={`w-full py-3 rounded-xl text-white font-bold shadow-lg transition-all hover:-translate-y-0.5 ${processing ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'}`}
                >
                    {processing ? 'Items Processing...' : 'Process All Export Requests'}
                </button>

                {processLogs.length > 0 && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Process Log:</h3>
                        <div className="max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                            {processLogs.map((log, idx) => (
                                <div key={idx} className={`text-sm flex items-start gap-2 ${log.status === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                                    <span className="mt-0.5">{log.status === 'success' ? '✓' : '✗'}</span>
                                    <span>
                                        <strong>Product {log.request.productId}:</strong> {log.result ? `Exported via Receipt #${log.result.id}` : log.error}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExportGoods;
