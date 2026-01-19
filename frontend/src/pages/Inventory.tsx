import React, { useEffect, useState } from 'react';
import { Search, PackageOpen, RotateCcw, Trash2 } from 'lucide-react';
import api from '../api';
import type { Batch, Product } from '../types';
import InventoryOverview from '../components/InventoryOverview';
import RecentActivity from '../components/RecentActivity';
import CriticalAlerts from '../components/CriticalAlerts';
import { inventoryManager } from '../services/InventoryManager';

const Inventory: React.FC = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [displayBatches, setDisplayBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        inventoryManager.clear();

        try {
            const response = await api.get('/products');
            const products: Product[] = response.data;
            await inventoryManager.loadExpiringData();
            const allBatches: Batch[] = [];

            products.forEach(p => {
                if (p.batches) {
                    p.batches.forEach(b => {
                        const batchWithProduct = {
                            ...b,
                            // @ts-ignore
                            product: p
                        };
                        allBatches.push(batchWithProduct);
                        inventoryManager.addBatch(batchWithProduct);
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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (!term.trim()) {
            setDisplayBatches(batches);
            return;
        }

        const preciseResult = inventoryManager.fastSearch(term);

        if (preciseResult) {
            setDisplayBatches(preciseResult);
        } else {
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
        <div className="space-y-8">
            {/* Top Grid: Overview, Alerts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 h-auto">
                <div className="lg:col-span-2 h-full">
                    <InventoryOverview batches={batches} />
                </div>
                <div className="h-full">
                    <CriticalAlerts batches={batches} />
                </div>
                <div className="h-full block lg:hidden xl:block">
                    <RecentActivity batches={batches} />
                </div>
            </div>

            {/* Inventory List Section */}
            <div className="bg-white rounded-3xl shadow-lg shadow-gray-100/50 border border-gray-100 flex flex-col overflow-hidden animate-slide-up stagger-3">
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            Inventory List
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                                {displayBatches.length} items
                            </span>
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Manage all your warehouse items in one place.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search product, ID, or barcode..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none transition-all placeholder-gray-400 font-medium text-gray-700"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <button onClick={loadData} className="p-3 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-xl transition-all shadow-sm" title="Reload Data">
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-32 text-gray-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                        <span className="animate-pulse font-medium">Loading warehouse data...</span>
                    </div>
                ) : displayBatches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-24 text-center">
                        <div className="bg-indigo-50 p-8 rounded-full mb-6">
                            <PackageOpen size={64} className="text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                        <p className="text-gray-400 max-w-sm mx-auto mb-8">
                            We couldn't find any items matching your search. Try a different term or barcode.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setDisplayBatches(batches); }}
                            className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Barcode</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Expiration</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {displayBatches.map((batch, index) => {
                                    const daysLeft = Math.ceil((new Date(batch.expirationDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                    let statusColor = "bg-emerald-100 text-emerald-700 border-emerald-200";
                                    let statusDot = "bg-emerald-500";
                                    let statusText = "Good";

                                    if (daysLeft < 0) {
                                        statusColor = "bg-rose-100 text-rose-700 border-rose-200";
                                        statusDot = "bg-rose-500";
                                        statusText = "Expired";
                                    } else if (daysLeft < 30) {
                                        statusColor = "bg-amber-100 text-amber-700 border-amber-200";
                                        statusDot = "bg-amber-500";
                                        statusText = "Expiring Soon";
                                    }

                                    // @ts-ignore
                                    const product = batch.product || {};

                                    const staggerClass = index < 10 ? `animate-slide-up stagger-${index + 1}` : 'animate-slide-up';
                                    return (
                                        <tr key={batch.id} className={`hover:bg-indigo-50/30 transition-colors group ${staggerClass}`} style={{ animationFillMode: 'both' }}>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                                        ) : (
                                                            <div className="w-full h-full bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 font-bold text-lg">
                                                                {product.name ? product.name.charAt(0).toUpperCase() : '#'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800 text-sm">{product.name || `Product #${batch.productId}`}</div>
                                                        <div className="text-xs text-gray-400 mt-0.5">{product.category || 'General'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{product.barcode || '-'}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-800">{batch.quantity}</span>
                                                    <span className="text-xs text-gray-400">{product.unit || 'units'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                                                {new Date(batch.expirationDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
                                                    {statusText}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Are you sure you want to delete this item?')) {
                                                            await inventoryManager.deleteBatch(batch.id);
                                                            loadData();
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 text-gray-400 hover:text-rose-600 font-medium text-sm px-3 py-1.5 hover:bg-rose-50 rounded-lg transition-all ml-auto">
                                                    <Trash2 size={16} />
                                                    Delete
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
