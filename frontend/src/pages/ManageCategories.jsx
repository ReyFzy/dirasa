import React, { useState } from 'react';
import useSWR from 'swr';
import api from '../lib/axios';
import Swal from 'sweetalert2';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const fetcher = (url) => api.get(url).then((res) => res.data);

const ManageCategories = () => {
  const { data: categories, mutate } = useSWR('/categories', fetcher);
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name: newCategory });
      setNewCategory('');
      mutate();
      Swal.fire({ icon: 'success', title: 'Kategori Ditambahkan', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
    } catch (err) {
      Swal.fire('Gagal', 'Nama kategori mungkin sudah ada', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Kategori?',
      text: "Produk dengan kategori ini mungkin akan terpengaruh.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/categories/${id}`);
        mutate();
      } catch (err) {
        Swal.fire('Gagal', 'Kategori tidak bisa dihapus karena masih digunakan oleh produk.', 'error');
      }
    }
  };

  return (
    <div className="font-jakarta max-w-2xl">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Kategori Menu</h1>
      
      <form onSubmit={handleAdd} className="flex gap-4 mb-10">
        <input 
          type="text" 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nama Kategori Baru (Contoh: Minuman)"
          className="flex-1 p-4 rounded-2xl border border-gray-100 bg-white outline-none focus:ring-2 focus:ring-primary shadow-sm"
          required
        />
        <button type="submit" className="bg-primary text-white px-8 rounded-2xl font-bold hover:bg-secondary transition flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> Tambah
        </button>
      </form>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Nama Kategori</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories?.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-bold text-gray-800">{cat.name}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleDelete(cat.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;