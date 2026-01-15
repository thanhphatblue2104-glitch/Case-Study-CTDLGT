import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const Layout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-slate-800 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold text-center border-b border-gray-700">
                    Warehouse
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-700">
                        📦 Inventory
                    </Link>
                    <Link to="/import" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-700">
                        📥 Import Goods
                    </Link>
                    <Link to="/export" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-700">
                        📤 Export Goods
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-white transition duration-200">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
