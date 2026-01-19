import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Batch } from '../types';
import { TrendingUp } from 'lucide-react';

interface InventoryOverviewProps {
    batches: Batch[];
}

const InventoryOverview: React.FC<InventoryOverviewProps> = ({ batches }) => {
    // Process data: Top 5 products by quantity
    const productMap = new Map<string, number>();

    batches.forEach(batch => {
        // @ts-ignore
        const productName = batch.product?.name || `Product ${batch.productId}`;
        const currentQty = productMap.get(productName) || 0;
        productMap.set(productName, currentQty + batch.quantity);
    });

    const data = Array.from(productMap.entries())
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5); // Top 5

    // Modern gradient palette
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

    return (
        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100/50 border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Top Inventory Items</h3>
                    <p className="text-sm text-gray-400 mt-1">Most stocked products this week</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl">
                    <TrendingUp className="text-indigo-600" size={24} />
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 20 }} barGap={2}>
                        <defs>
                            {colors.map((color, index) => (
                                <linearGradient key={`gradient-${index}`} id={`colorUv-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                                    <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                padding: '12px 20px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)'
                            }}
                            itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                        />
                        <Bar dataKey="quantity" radius={[8, 8, 8, 8]} barSize={48} animationDuration={1500}>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={`url(#colorUv-${index % colors.length})`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default InventoryOverview;
