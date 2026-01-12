import React from 'react';
import useSWR from 'swr';
import api from '../lib/axios';
import { ArrowLeftIcon, CheckBadgeIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const fetcher = (url) => api.get(url).then((res) => res.data);

const OrderHistory = () => {
    const navigate = useNavigate();
    const { data: orders } = useSWR('/orders', fetcher);
    
    const historyOrders = orders?.filter(o => o.status === 'SELESAI' || o.status === 'BATAL');

    return (
        <div className="min-h-screen bg-gray-50 font-jakarta p-6 md:p-20">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 font-bold text-primary hover:underline">
                    <ArrowLeftIcon className="w-4 h-4" /> Kembali ke Dashboard
                </button>
                
                <h1 className="text-4xl font-black mb-10 tracking-tighter uppercase italic text-gray-900">Arsip Pesanan</h1>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">ID & Pelanggan</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">Waktu</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">Total</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {historyOrders?.map((order) => (
                                <tr key={order.id} className="text-sm">
                                    <td className="px-8 py-5">
                                        <p className="font-mono text-[10px] text-gray-400">#{order.id.substring(0,8).toUpperCase()}</p>
                                        <p className="font-bold text-gray-800">{order.user?.name || 'Guest'} (Meja {order.tableNumber})</p>
                                    </td>
                                    <td className="px-8 py-5 text-gray-500">
                                        {new Date(order.createdAt).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-8 py-5 font-black text-gray-900">
                                        Rp {order.totalPrice.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${
                                            order.status === 'SELESAI' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;