import React, { useEffect, useState } from 'react';
import api from '../api';
import type { Batch, Product } from '../types';

const Inventory: React.FC = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        loadData();
    }, [searchTerm]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (searchTerm.trim()) {
                setIsSearching(true);
                const response = await api.get(`/products?search=${searchTerm}`);
                const products: Product[] = response.data;
                // Flatten batches and attach product info
                const foundBatches: Batch[] = [];
                products.forEach(p => {
                    if (p.batches) {
                        p.batches.forEach(b => {
                            foundBatches.push({
                                ...b,
                                // @ts-ignore - manual attachment for display
                                product: p
                            });
                        });
                    }
                });
                setBatches(foundBatches);
            } else {
                setIsSearching(false);
                const response = await api.get('/inventory/expiring');
                setBatches(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch inventory", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {isSearching ? `Search Results for "${searchTerm}"` : 'Inventory Status (Sorted by Expiration)'}
                </h2>
                <div className="w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search by name or barcode..."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center p-10">Loading...</div>
            ) : batches.length === 0 ? (
                <div className="text-center p-10 text-gray-500">No inventory found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {batches.map((batch) => {
                                const daysLeft = Math.ceil((new Date(batch.expirationDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                let statusClass = "text-green-600";
                                let statusText = "Good";

                                if (daysLeft < 0) {
                                    statusClass = "text-red-600 font-bold";
                                    statusText = "Expired";
                                } else if (daysLeft < 7) {
                                    statusClass = "text-yellow-600 font-bold";
                                    statusText = "Expiring Soon";
                                }

                                // @ts-ignore
                                const product = batch.product || {};

                                return (
                                    <tr key={batch.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{product.name || `Product #${batch.productId}`}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.barcode || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">{batch.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(batch.expirationDate).toLocaleDateString()}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${statusClass}`}>
                                            {statusText} ({daysLeft} days)
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Inventory;
