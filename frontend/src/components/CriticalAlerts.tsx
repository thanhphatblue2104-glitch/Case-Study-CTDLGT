import React, { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import { inventoryManager } from '../services/InventoryManager';
import type { Batch } from '../types';

interface CriticalAlertsProps {
    batches: Batch[];
}

const CriticalAlerts: React.FC<CriticalAlertsProps> = ({ batches }) => {
    const [expiringItems, setExpiringItems] = useState<Batch[]>([]);

    useEffect(() => {
        const top3 = inventoryManager.getTopExpiring(3);
        setExpiringItems(top3);
    }, [batches]);

    if (expiringItems.length === 0) return (
        <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-100/50 border border-gray-100 h-full flex flex-col justify-center items-center text-center animate-slide-up stagger-1">
            <div className="bg-green-50 p-4 rounded-full mb-4">
                <AlertCircle className="text-green-500" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">All Good!</h3>
            <p className="text-sm text-gray-400 mt-1">No critical inventory alerts at the moment.</p>
        </div>
    );

    return (
        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100/50 border border-gray-100 flex flex-col h-full relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[100px] -mr-8 -mt-8 opacity-50 pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        Critical Alerts
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-subtle"></span>
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">Action required for {expiringItems.length} items</p>
                </div>
                <div className="bg-red-50 p-3 rounded-xl animate-pulse-subtle">
                    <AlertTriangle size={24} className="text-red-500" />
                </div>
            </div>

            <div className="flex-1 space-y-4 relative">
                {expiringItems.map((batch) => {
                    const daysLeft = Math.ceil((new Date(batch.expirationDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                    // @ts-ignore
                    const productName = batch.product?.name || `Batch #${batch.id} `;

                    const isUrgent = daysLeft <= 2;

                    return (
                        <div key={batch.id} className="group bg-white p-4 rounded-2xl border border-gray-100 hover:border-red-100 hover:shadow-md hover:shadow-red-50 transition-all duration-300 relative cursor-pointer">
                            <div className={`absolute left - 0 top - 4 bottom - 4 w - 1 rounded - r - lg ${isUrgent ? 'bg-red-500' : 'bg-orange-400'} `} />

                            <div className="ml-3 flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm truncate pr-2">{productName}</h4>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`text - xs font - bold px - 2 py - 0.5 rounded - md ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'} `}>
                                            {daysLeft < 0 ? 'Expired' : `${daysLeft} days left`}
                                        </span>
                                        <span className="text-xs text-gray-400">ID: {batch.id}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                        {new Date(batch.expirationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            {/* Hover Action */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
                                <ArrowRight size={18} className="text-gray-400 hover:text-red-500" />
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="mt-6 w-full py-3 rounded-xl bg-gray-50 text-gray-600 text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                View All Alerts
            </button>
        </div>
    );
};

export default CriticalAlerts;
