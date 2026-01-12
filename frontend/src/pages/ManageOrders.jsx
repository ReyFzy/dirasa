import React, { useState } from 'react';
import useSWR from 'swr';
import api from '../lib/axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import {
    EyeIcon,
    XMarkIcon,
    ShoppingBagIcon,
    CheckCircleIcon,
    ClockIcon,
    ChatBubbleLeftEllipsisIcon,
    HashtagIcon,
    UserIcon,
    ChartBarIcon, 
    ArchiveBoxIcon 
} from '@heroicons/react/24/outline';

const fetcher = (url) => api.get(url).then((res) => res.data);

const ManageOrders = () => {
    const navigate = useNavigate();
    const { data: orders, mutate } = useSWR('/orders', fetcher);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const activeOrders = orders?.filter(order => order.status !== 'SELESAI' && order.status !== 'BATAL');

    const toast = (message, icon = 'success') => {
        Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        }).fire({ icon, title: message });
    };

    const openDetail = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/status/${orderId}`, { status: newStatus });
            toast(`Pesanan diperbarui ke ${newStatus}`);
            mutate();
            if (selectedOrder) setIsModalOpen(false);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Gagal memperbarui status';
            toast(errorMsg, 'error');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ANTRE': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'DIBUAT': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'DIANTAR': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'SELESAI': return 'bg-green-50 text-green-600 border-green-100';
            case 'BATAL': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const formatIDR = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="font-jakarta p-4 md:p-8 bg-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Manage Orders</h1>
                    <p className="text-gray-500 font-medium">Monitoring pesanan real-time dapur Dirasa.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link 
                        to="/dashboard/orders/history" 
                        className="bg-white text-gray-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 border border-gray-100 shadow-sm hover:bg-gray-50 transition-all text-sm"
                    >
                        <ArchiveBoxIcon className="w-5 h-5 text-gray-400" /> History
                    </Link>
                    <Link 
                        to="/dashboard/orders/report" 
                        className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-gray-200 hover:scale-105 transition-all text-sm"
                    >
                        <ChartBarIcon className="w-5 h-5 text-primary" /> Laporan Pendapatan
                    </Link>
                </div>

                <div className="bg-white px-8 py-5 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Active Orders</p>
                    <p className="text-3xl font-black text-primary leading-none">{activeOrders?.length || 0}</p>
                </div>
            </div>

            {/* Tabel */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Meja</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {activeOrders?.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-8 py-5">
                                        <p className="font-mono text-[10px] text-gray-400 mb-1">#{order.id.substring(0, 8).toUpperCase()}</p>
                                        <p className="font-bold text-gray-800 flex items-center gap-2">
                                            <UserIcon className="w-4 h-4 text-gray-400" />
                                            {order.user?.name || 'Guest'}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="inline-flex items-center justify-center bg-gray-900 text-white w-10 h-10 rounded-xl font-black text-sm">
                                            {order.tableNumber || '-'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-black text-gray-900 italic">
                                        {formatIDR(order.totalPrice)}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button onClick={() => openDetail(order)} className="p-3 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all duration-300">
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {activeOrders?.length === 0 && (
                        <div className="p-20 text-center text-gray-300 font-bold italic">Tidak ada pesanan aktif.</div>
                    )}
                </div>
            </div>

            {/* Modal Detail Pesanan */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden relative">
                        
                        <div className="p-8 pb-4 flex justify-between items-start border-b border-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-primary text-white rounded-3xl shadow-lg shadow-primary/30">
                                    <ShoppingBagIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Detail Order</h3>
                                    <p className="text-gray-400 font-mono text-xs">#{selectedOrder.id.toUpperCase()}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="p-3 bg-gray-100 text-gray-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 pt-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lokasi Meja</p>
                                    <div className="flex items-center gap-2 text-xl font-black text-gray-900">
                                        <HashtagIcon className="w-5 h-5 text-primary" />
                                        <span>MEJA {selectedOrder.tableNumber || '-'}</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Pelanggan</p>
                                    <p className="font-bold text-gray-800 truncate">{selectedOrder.user?.name || 'Guest'}</p>
                                </div>
                            </div>

                            <div className={`mb-6 p-5 rounded-3xl border-2 border-dashed flex gap-4 ${selectedOrder.note ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                                <ChatBubbleLeftEllipsisIcon className={`w-6 h-6 shrink-0 ${selectedOrder.note ? 'text-amber-500' : 'text-gray-300'}`} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Catatan Pesanan</p>
                                    <p className={`text-sm italic font-medium ${selectedOrder.note ? 'text-gray-700' : 'text-gray-400'}`}>
                                        {selectedOrder.note || 'Tidak ada catatan khusus.'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-xs">
                                                {item.qty}x
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{item.product?.name || 'Menu'}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{formatIDR(item.price)}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-gray-900">{formatIDR(item.price * item.qty)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-6 px-2">
                                    <p className="text-gray-400 font-black uppercase text-xs tracking-[0.2em]">Total Bayar</p>
                                    <p className="text-3xl font-black text-primary italic tracking-tighter">{formatIDR(selectedOrder.totalPrice)}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <button onClick={() => updateStatus(selectedOrder.id, 'DIBUAT')} className="flex flex-col items-center gap-2 p-4 rounded-[2rem] bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all group shadow-sm shadow-blue-100">
                                        <ClockIcon className="w-6 h-6 group-hover:scale-110 transition" />
                                        <span className="text-[10px] font-black uppercase text-center">Masak</span>
                                    </button>
                                    <button onClick={() => updateStatus(selectedOrder.id, 'DIANTAR')} className="flex flex-col items-center gap-2 p-4 rounded-[2rem] bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-all group shadow-sm shadow-purple-100">
                                        <CheckCircleIcon className="w-6 h-6 group-hover:scale-110 transition" />
                                        <span className="text-[10px] font-black uppercase text-center">Antar</span>
                                    </button>
                                    <button onClick={() => updateStatus(selectedOrder.id, 'BATAL')} className="flex flex-col items-center gap-2 p-4 rounded-[2rem] bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all group shadow-sm shadow-red-100">
                                        <XMarkIcon className="w-6 h-6 group-hover:scale-110 transition" />
                                        <span className="text-[10px] font-black uppercase text-center">Batal</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;