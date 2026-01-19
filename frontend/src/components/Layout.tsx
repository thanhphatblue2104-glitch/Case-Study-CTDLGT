import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Import, Upload, Package } from 'lucide-react';

const Layout: React.FC = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(true);

    const menuItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/import', icon: Import, label: 'Import Goods' },
        { path: '/export', icon: Upload, label: 'Export Goods' },
    ];

    return (
        <div className="flex h-screen bg-[#F3F4F6] font-[Roboto]">
            {/* Sidebar */}
            <aside
                className={`bg-white shadow-lg z-20 transition-all duration-300 ease-in-out flex flex-col ${collapsed ? 'w-20' : 'w-72'}`}
                onMouseEnter={() => setCollapsed(false)}
                onMouseLeave={() => setCollapsed(true)}
            >
                <div className="flex items-center justify-center h-20 border-b border-gray-100 overflow-hidden">
                    <div className={`flex items-center gap-3 transition-all duration-300 ${collapsed ? 'px-0' : 'px-6 w-full'}`}>
                        <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-xl shadow-indigo-200 shadow-md flex-shrink-0 mx-auto">
                            <Package className="text-white" size={24} />
                        </div>
                        <span className={`font-bold text-xl text-gray-800 tracking-tight whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                            Warehouse
                        </span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                                    : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
                                )}
                                <Icon
                                    size={22}
                                    className={`flex-shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span className={`whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
                                    {item.label}
                                </span>
                                {collapsed && isActive && (
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-1 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="text-xs text-center text-gray-400">© 2026 Warehouse Inc.</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC] animate-fade-in">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-10 px-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                        </h1>
                        <p className="text-sm text-gray-400 mt-0.5">Welcome back, here's what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors relative">
                            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 scroll-smooth">
                    <div className="max-w-[1600px] mx-auto space-y-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
