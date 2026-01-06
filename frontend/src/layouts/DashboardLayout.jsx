import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#fdf8f4] font-jakarta">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <DashboardNavbar />
        <main className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;