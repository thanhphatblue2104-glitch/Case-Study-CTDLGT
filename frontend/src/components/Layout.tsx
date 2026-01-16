import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Import, Upload, Package } from 'lucide-react';

const Layout: React.FC = () => {
    const location = useLocation();
    const [hovered, setHovered] = useState(false);

    const menuItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        // { path: '/inventory', icon: Package, label: 'Inventory' }, // Consolidated into Dashboard for now as per request
        { path: '/import', icon: Import, label: 'Import Goods' },
        { path: '/export', icon: Upload, label: 'Export Goods' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Floating Sidebar */}
            <div
                className={`relative m-4 bg-white shadow-xl rounded-2xl flex flex-col justify-between transition-all duration-300 ease-in-out z-20 ${hovered ? 'w-64' : 'w-20'}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="flex flex-col py-6">
                    <div className="flex items-center justify-center h-12 mb-8">
                        <div className="bg-blue-600 text-white p-2 rounded-lg">
                            <Package size={24} />
                        </div>
                        {hovered && <span className="ml-3 text-xl font-bold text-gray-800 whitespace-nowrap overflow-hidden transition-opacity duration-300 delay-100">Warehouse</span>}
                    </div>

                    <nav className="flex-1 space-y-2 px-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center p-3 rounded-xl transition-colors duration-200 group ${isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={24} className={`${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    {hovered && (
                                        <span className="ml-4 font-medium whitespace-nowrap overflow-hidden transition-opacity duration-300">
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-100">
                    {hovered && <div className="text-xs text-center text-gray-400">© 2026 Warehouse Inc.</div>}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header with Backdrop Blur */}
                <header className="absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-10 flex items-center px-8 border-b border-gray-100/50">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h1>
                </header>

                <main className="flex-1 overflow-y-auto pt-20 pb-8 px-8">
                    <div className="max-w-7xl mx-auto h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
