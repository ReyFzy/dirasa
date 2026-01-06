import React from 'react';
import useSWR from 'swr';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const fetcher = (url) => api.get(url).then((res) => res.data);

const OrderPage = () => {
  const navigate = useNavigate();
  const { data: orders, mutate } = useSWR('/orders/my-orders', fetcher);

  const handleReceived = async (orderId) => {
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: "Apakah pesanan sudah Anda terima dengan baik?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Sudah!'
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/orders/${orderId}/received`);
        
        Swal.fire('Berhasil!', 'Terima kasih sudah berbelanja.', 'success');
        mutate(); 
      } catch (error) {
        Swal.fire('Gagal!', error.response?.data?.message || 'Terjadi kesalahan.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-jakarta p-6 md:p-20">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')} 
          className="mb-8 text-primary font-bold flex items-center gap-2 hover:underline"
        >
          ← Kembali ke Menu
        </button>
        
        <h1 className="text-4xl font-black mb-10 tracking-tighter italic uppercase">Riwayat Pesanan</h1>

        <div className="space-y-6">
          {orders?.length > 0 ? orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                  <p className="text-xs font-mono text-gray-500">#{order.id.substring(0, 13)}...</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest border ${
                  order.status === 'SELESAI' 
                    ? 'bg-green-50 text-green-600 border-green-100' 
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-2xl">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{item.product?.name}</span>
                      <span className="text-[10px] text-gray-400">Qty: {item.qty}</span>
                    </div>
                    <span className="font-black text-gray-900">
                      Rp {(Number(item.price) * item.qty).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed pt-4 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Pembayaran</p>
                  <p className="text-2xl font-black text-primary italic">
                    Rp {Number(order.totalPrice).toLocaleString('id-ID')}
                  </p>
                </div>
                
                {/* Tombol hanya muncul jika status adalah DIANTAR */}
                {order.status === 'DIANTAR' && (
                  <button 
                    onClick={() => handleReceived(order.id)}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 uppercase tracking-tighter"
                  >
                    Pesanan Diterima
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 border-dashed">
               <p className="text-gray-300 font-bold italic text-xl">Belum ada pesanan.</p>
               <button 
                 onClick={() => navigate('/')}
                 className="mt-4 text-primary text-sm font-bold underline"
               >
                 Mulai Belanja Sekarang
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;