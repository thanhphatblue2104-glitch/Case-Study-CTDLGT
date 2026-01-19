import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, Clock, ArrowUpRight, Activity } from 'lucide-react';
import { inventoryManager } from '../services/InventoryManager';
import type { Order } from '../services/InventoryManager';
import type { Batch } from '../types';

interface RecentActivityProps {
    batches: Batch[]; // Used as a trigger to refresh data
}

const RecentActivity: React.FC<RecentActivityProps> = ({ batches }) => {
    const [history, setHistory] = useState<Order[]>([]);

    useEffect(() => {
        // Fetch history from the OrderQueue in the Manager
        // Complexity: O(1) - Getting reference to history array
        const currentHistory = inventoryManager.orderQueue.getHistory();
        setHistory([...currentHistory]); // Clone to trigger re-render
    }, [batches]);

    return (
        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100/50 border border-gray-100 h-full overflow-hidden flex flex-col animate-slide-up stagger-2">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
                    <p className="text-sm text-gray-400 mt-1">Real-time import/export log</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                    <Activity size={24} className="text-blue-500" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                        <Clock size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No recent activity detected.</p>
                    </div>
                ) : history.slice(0, 10).map(order => ( // Show top 10 recent
                    <div key={order.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-sm transition-all duration-200">
                        <div className={`p-3 rounded-xl ${order.type === 'IMPORT' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            {order.type === 'IMPORT' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-bold text-gray-800 text-sm truncate">
                                    {order.type === 'IMPORT' ? 'Goods Received' : 'Goods Dispatched'}
                                </p>
                                <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                    #{order.id}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mb-1">
                                Product ID: <span className="font-mono text-gray-700">{order.productId}</span> • Qty: <span className="font-bold text-gray-800">{order.quantity}</span>
                            </p>
                            <p className="text-[10px] text-gray-400">
                                {new Date(order.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
