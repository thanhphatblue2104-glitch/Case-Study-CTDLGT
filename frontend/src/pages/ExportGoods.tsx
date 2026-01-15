import React, { useState, useEffect } from 'react';
import api from '../api';
import type { Product } from '../types';

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
            <div className="bg-white p-8 rounded-lg shadow hidden-scrollbar">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Request Export</h2>
                {message && (
                    <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleRequestExport}>
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
                                <option key={p.id} value={p.id}>{p.name} (Stock available)</option>
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
                        <label className="block text-gray-700 mb-2">Customer ID (Optional)</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                            value={customerId}
                            onChange={e => setCustomerId(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
                        Add to Export Queue
                    </button>
                </form>

                {queuePosition !== null && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                        Current Queue Size: <strong>{queuePosition}</strong>
                    </div>
                )}
            </div>

            {/* Queue Management */}
            <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Queue Management</h2>
                <p className="text-gray-600 mb-4">
                    The backend uses a <strong>Min-Heap</strong> to prioritize oldest batches when fulfilling requests from the <strong>Queue</strong>.
                </p>

                <button
                    onClick={handleProcessQueue}
                    disabled={processing}
                    className={`w-full py-3 rounded text-white font-bold transition ${processing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {processing ? 'Processing...' : 'Process All Export Requests'}
                </button>

                {processLogs.length > 0 && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="font-bold text-gray-700 mb-2">Process Log:</h3>
                        <div className="max-h-60 overflow-y-auto bg-gray-50 p-4 rounded border">
                            {processLogs.map((log, idx) => (
                                <div key={idx} className={`mb-2 text-sm ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    <strong>{log.status === 'success' ? '✓' : '✗'} Product {log.request.productId}:</strong> {log.result ? `Exported via Receipt #${log.result.id}` : log.error}
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
