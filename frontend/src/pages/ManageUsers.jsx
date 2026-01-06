import React, { useEffect } from 'react';
import useSWR from 'swr';
import api from '../lib/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { 
  TrashIcon, 
  ShieldCheckIcon, 
} from '@heroicons/react/24/outline';

const fetcher = (url) => api.get(url).then((res) => res.data);

const ManageUsers = () => {
  const navigate = useNavigate();
  const { data: users, mutate } = useSWR('/users', fetcher);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') navigate('/');
  }, [navigate]);

  const toast = (message, icon = 'success') => {
    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    }).fire({ icon, title: message });
  };

  // Fungsi Toggle Role Langsung
  const handleToggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    
    const result = await Swal.fire({
      title: 'Ubah Role?',
      text: `Ubah akses ${user.name} menjadi ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#b6713c',
      confirmButtonText: 'Ya, Ubah!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/users/role/${user.id}`, { role: newRole });
        toast(`Role ${user.name} berhasil diubah ke ${newRole}`);
        mutate();
      } catch (err) {
        toast(err.response?.data?.message || 'Gagal mengubah role', 'error');
      }
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `Hapus ${name}?`,
      text: "User ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${id}`);
        toast('User berhasil dihapus');
        mutate();
      } catch (err) {
        toast('Gagal menghapus user', 'error');
      }
    }
  };

  return (
    <div className="font-jakarta p-4">
      {/* Header Halaman */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Manajemen User</h1>
          <p className="text-gray-500">Klik icon perisai untuk mengubah hak akses user dengan cepat.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total User</p>
          <p className="text-2xl font-black text-primary">{users?.length || 0}</p>
        </div>
      </div>

      {/* Tabel User */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Pengguna</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Email</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Role Aktif</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-gray-800">{user.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm italic">{user.email}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${
                    user.role === 'ADMIN' 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-gray-400 border-gray-200'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    {/* Tombol Ganti Role Langsung */}
                    <button 
                      onClick={() => handleToggleRole(user)} 
                      title="Ganti Role Otomatis"
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition active:scale-90"
                    >
                      <ShieldCheckIcon className="w-6 h-6" />
                    </button>
                    
                    {/* Tombol Hapus */}
                    <button 
                      onClick={() => handleDelete(user.id, user.name)} 
                      title="Hapus User"
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition active:scale-90"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;