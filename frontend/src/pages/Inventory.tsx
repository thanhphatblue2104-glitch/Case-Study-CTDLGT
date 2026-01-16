import React, { useEffect, useState } from 'react';
import { Search, PackageOpen, RotateCcw } from 'lucide-react';
import api from '../api';
import type { Batch, Product } from '../types';
import InventoryOverview from '../components/InventoryOverview';
import RecentActivity from '../components/RecentActivity';
import CriticalAlerts from '../components/CriticalAlerts';
import { inventoryManager } from '../services/InventoryManager'; // Import the Singleton Manager

const Inventory: React.FC = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [displayBatches, setDisplayBatches] = useState<Batch[]>([]); // Separated state for display vs raw data
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    // 1. Load Data & Initialize Manager
    const loadData = async () => {
        setLoading(true);
        // Clear manager before reloading to avoid duplicates in this demo
        inventoryManager.clear();

        try {
            // Fetch all products to populate the manager (In a real app, we might paginate, but for this demo needed for Client-side Search)
            const response = await api.get('/products');
            const products: Product[] = response.data;

            const allBatches: Batch[] = [];

            products.forEach(p => {
                if (p.batches) {
                    p.batches.forEach(b => {
                        const batchWithProduct = {
                            ...b,
                            // @ts-ignore - manual attachment for display
                            product: p
                        };
                        allBatches.push(batchWithProduct);
                        // Add to Manager (Heap & Map)
                        inventoryManager.addBatch(batchWithProduct);

                        // Simulate "Recent Activity" by adding to Queue History
                        inventoryManager.addOrder({
                            id: Math.floor(Math.random() * 10000),
                            type: 'IMPORT',
                            productId: p.id,
                            quantity: b.quantity,
                            timestamp: new Date(b.createdAt)
                        });
                    });
                }
            });

            setBatches(allBatches);
            setDisplayBatches(allBatches);
        } catch (error) {
            console.error("Failed to fetch inventory", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Fast Search Implementation (O(1))
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (!term.trim()) {
            setDisplayBatches(batches);
            return;
        }

        // Use Manager's Fast Search (Map Lookup)
        const preciseResult = inventoryManager.fastSearch(term);

        if (preciseResult) {
            console.log(`[Fast Search] Instant Match for ${term}`);
            setDisplayBatches(preciseResult);
        } else {
            // Fallback for partial name search (O(n)) if not a specific barcode
            const lowerTerm = term.toLowerCase();
            const filtered = batches.filter(b =>
                // @ts-ignore
                b.product?.name.toLowerCase().includes(lowerTerm) ||
                // @ts-ignore
                b.product?.barcode.includes(term)
            );
            setDisplayBatches(filtered);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Grid: Overview, Alerts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:h-[400px] h-auto">
                <div className="lg:col-span-2 h-full">
                    <InventoryOverview batches={batches} />
                </div>
                <div className="h-full">
                    <CriticalAlerts batches={batches} />
                </div>
                <div className="h-full">
                    {/* Bind "Recent Activity" to Manager's Queue History */}
                    <RecentActivity batches={batches} />
                </div>
            </div>

            {/* Inventory List Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        Inventory List
                        <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {displayBatches.length} Items
                        </span>
                    </h2>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Scan barcode for O(1) search..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <button onClick={loadData} className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors" title="Reload Data">
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-20 text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                        Loading inventory...
                    </div>
                ) : displayBatches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center">
                        <div className="bg-blue-50 p-6 rounded-full mb-4">
                            <PackageOpen size={48} className="text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700 mb-1">No products found</h3>
                        <p className="text-gray-400 max-w-xs mx-auto mb-6">
                            Try searching for a different barcode or name.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setDisplayBatches(batches); }}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[300px]">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">Barcode</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[150px]">Batch Info</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[100px]">Stock</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">Expiration</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[80px]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {displayBatches.map((batch) => {
                                    const daysLeft = Math.ceil((new Date(batch.expirationDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                    let statusColor = "bg-green-100 text-green-700";
                                    let statusDot = "bg-green-500";
                                    let statusText = "Good";

                                    if (daysLeft < 0) {
                                        statusColor = "bg-red-100 text-red-700";
                                        statusDot = "bg-red-500";
                                        statusText = "Expired";
                                    } else if (daysLeft < 7) {
                                        statusColor = "bg-yellow-100 text-yellow-700";
                                        statusDot = "bg-yellow-500";
                                        statusText = "Expiring Soon";
                                    }

                                    // @ts-ignore
                                    const product = batch.product || {};

                                    return (
                                        <tr key={batch.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm overflow-hidden border border-gray-100">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span>{product.name ? product.name.charAt(0).toUpperCase() : '#'}</span>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-gray-900">{product.name || `Product #${batch.productId}`}</div>
                                                        <div className="text-xs text-gray-400">Category: {product.category || 'General'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{product.barcode || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex flex-col">
                                                    <span className="text-xs uppercase text-gray-400 font-bold">ID: {batch.id}</span>
                                                    <span className="text-xs">Imported: {new Date(batch.createdAt || Date.now()).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-800">{batch.quantity} <span className="text-gray-400 font-normal text-xs">{product.unit || 'units'}</span></div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(batch.expirationDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
                                                    {statusText}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-gray-400 hover:text-blue-600 p-1 rounded-lg hover:bg-blue-50 transition-colors">
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
