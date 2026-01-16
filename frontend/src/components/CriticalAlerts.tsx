import React, { useEffect, useState } from 'react';
import { AlertTriangle, Timer } from 'lucide-react';
import { inventoryManager } from '../services/InventoryManager';
import type { Batch } from '../types';

interface CriticalAlertsProps {
    batches: Batch[]; // Pass batches to trigger updates when data changes
}

const CriticalAlerts: React.FC<CriticalAlertsProps> = ({ batches }) => {
    const [expiringItems, setExpiringItems] = useState<Batch[]>([]);

    useEffect(() => {
        // Use the Min-Heap to get top 3 expiring items
        // Complexity: O(k log n) or O(n log n) depending on implementation
        const top3 = inventoryManager.getTopExpiring(3);
        setExpiringItems(top3);
    }, [batches]); // Re-run when data changes

    if (expiringItems.length === 0) return null;

    return (
        <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-100 p-2 rounded-lg">
                    <AlertTriangle size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-red-800">Critical Alerts</h3>
            </div>

            <div className="flex-1 space-y-3">
                {expiringItems.map((batch) => {
                    const daysLeft = Math.ceil((new Date(batch.expirationDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                    // @ts-ignore
                    const productName = batch.product?.name || `Batch #${batch.id}`;

                    return (
                        <div key={batch.id} className="bg-white p-3 rounded-xl border-l-4 border-red-500 shadow-sm flex justify-between items-center group hover:shadow-md transition-all">
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{productName}</p>
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                    <Timer size={12} /> Expires in {daysLeft} days
                                </p>
                            </div>
                            <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
                                {new Date(batch.expirationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CriticalAlerts;
