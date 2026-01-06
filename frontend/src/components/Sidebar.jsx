import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  TagIcon, 
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Manajemen User', path: '/dashboard/users', icon: UsersIcon },
    { name: 'Produk (Menu)', path: '/dashboard/products', icon: ShoppingBagIcon },
    { name: 'Kategori', path: '/dashboard/categories', icon: TagIcon },
    { name: 'Pesanan (Orders)', path: '/dashboard/orders', icon: ClipboardDocumentListIcon },
  ];

  return (
    <div className="w-64 bg-white min-h-screen border-r border-gray-100 flex flex-col">
      <div className="p-8">
        <h1 className="text-2xl font-black text-primary tracking-tighter">DIRASA.</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                isActive 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 transition-colors font-bold text-sm">
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          Keluar ke Toko
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;