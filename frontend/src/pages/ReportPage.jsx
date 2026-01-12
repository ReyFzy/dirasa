import React, { useState } from 'react';
import useSWR from 'swr';
import api from '../lib/axios';
import { PrinterIcon, ArrowLeftIcon, ChartBarIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const fetcher = (url) => api.get(url).then((res) => res.data);

const ReportPage = () => {
  const navigate = useNavigate();
  
  const today = new Date().toISOString().split('T')[0];
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(today);

  const { data: report } = useSWR(`/orders/report?start=${startDate}&end=${endDate}`, fetcher);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50 font-jakarta p-4 md:p-10">
      <div className="max-w-4xl mx-auto mb-10 print:hidden">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-gray-500 hover:text-primary">
            <ArrowLeftIcon className="w-5 h-5" /> Kembali
          </button>
          <button onClick={handlePrint} className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg">
            <PrinterIcon className="w-5 h-5" /> Cetak
          </button>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1 block">Dari Tanggal</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1 block">Sampai Tanggal</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="bg-primary/10 p-3 rounded-xl text-primary">
            <CalendarDaysIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {report ? (
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 print:shadow-none print:border-none">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Laporan Pendapatan</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
               Periode: {new Date(startDate).toLocaleDateString('id-ID')} - {new Date(endDate).toLocaleDateString('id-ID')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Total Pendapatan</p>
              <p className="text-4xl font-black text-gray-900 italic">Rp {report.totalRevenue?.toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total Pesanan</p>
              <p className="text-4xl font-black text-gray-900 italic">{report.totalOrders} <span className="text-sm font-bold text-gray-400 not-italic uppercase">Selesai</span></p>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <ChartBarIcon className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-black uppercase tracking-tighter">Menu Terlaris</h3>
            </div>
            <div className="border border-gray-100 rounded-3xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Nama Menu</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Terjual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {report.bestSellers.length > 0 ? report.bestSellers.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-black">{item.qty}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="2" className="p-10 text-center text-gray-400 font-bold italic">Tidak ada data di periode ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-20 font-black text-gray-300 animate-pulse">MEMUAT DATA...</div>
      )}
    </div>
  );
};

export default ReportPage;