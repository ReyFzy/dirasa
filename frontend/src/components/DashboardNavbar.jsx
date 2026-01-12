import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardNavbar = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center sticky top-0 z-10 print:hidden">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">
          <span className="text-primary">DI</span>DASHBOARD
        </h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
          Sistem Manajemen DIRASA
        </p>
      </div>
      <button 
        onClick={() => navigate('/')} 
        className="text-xs font-black text-primary border-2 border-primary px-5 py-2.5 rounded-2xl hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm"
      >
        KEMBALI KE TOKO
      </button>
    </header>
  );
};

export default DashboardNavbar;