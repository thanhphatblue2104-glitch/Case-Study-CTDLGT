import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, Clock, ArrowUpRight } from 'lucide-react';
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-blue-500" /> Recent Activity (Queue History)
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {history.length === 0 ? (
                    <p className="text-gray-400 text-sm">No recent activity detected.</p>
                ) : history.slice(0, 10).map(order => ( // Show top 10 recent
                    <div key={order.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200">
                        <div className={`p-2 rounded-lg mt-1 ${order.type === 'IMPORT' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            {order.type === 'IMPORT' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">
                                {order.type} Request #{order.id}
                            </p>
                            <p className="text-xs text-gray-500">
                                Product ID: {order.productId} - Qty: {order.quantity}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
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
