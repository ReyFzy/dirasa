import React, { useState, useRef } from 'react';
import useSWR from 'swr';
import api from '../lib/axios';
import Swal from 'sweetalert2';
import { PencilSquareIcon, TrashIcon, PhotoIcon, CloudArrowUpIcon, XMarkIcon, CubeIcon } from '@heroicons/react/24/outline';

const fetcher = (url) => api.get(url).then((res) => res.data);

const ManageProducts = () => {
  const { data: products, mutate } = useSWR('/products', fetcher);
  const { data: categories } = useSWR('/categories', fetcher);

  const IMAGE_BASE_URL = 'https://res.cloudinary.com/dxiwztoru/image/upload/';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    categoryId: '',
    image: null
  });

  const toast = (message, icon = 'success') => {
    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    }).fire({ icon, title: message });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        categoryId: product.categoryId,
        image: null
      });
      setImagePreview(product.image);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', stock: '0', description: '', categoryId: '', image: null });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('description', formData.description);
    data.append('categoryId', formData.categoryId);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingProduct) {
        const result = await Swal.fire({
          title: 'Simpan Perubahan?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#b6713c',
          confirmButtonText: 'Ya, Update!'
        });
        if (result.isConfirmed) {
          await api.put(`/products/${editingProduct.id}`, data);
          toast('Produk berhasil diperbarui');
        } else return;
      } else {
        await api.post('/products', data);
        toast('Produk baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
      mutate();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal menyimpan data', 'error');
    }
  };

  return (
    <div className="font-jakarta p-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Manajemen Produk</h1>
          <p className="text-gray-500">Kelola stok dan menu makananmu.</p>
        </div>
        <button onClick={() => openModal()} className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-secondary transition shadow-lg active:scale-95">+ Tambah Menu</button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Produk</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Kategori</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Stok</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Harga</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4 flex items-center gap-4">
                  <img
                    src={item.image.startsWith('blob') ? item.image : `${IMAGE_BASE_URL}${item.image}`}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 shadow-sm"
                    alt={item.name}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                  />
                  <span className="font-bold text-gray-800">{item.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-md font-bold text-gray-500">{item.category?.name}</span>
                </td>
                {/* Column Stock dengan Indikator Warna */}
                <td className="px-6 py-4 text-center">
                  <span className={`font-bold px-3 py-1 rounded-full text-xs ${item.stock <= 5 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                    {item.stock} Porsi
                  </span>
                </td>
                <td className="px-6 py-4 font-black text-primary">Rp {item.price.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => openModal(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"><PencilSquareIcon className="w-5 h-5" /></button>
                  <button onClick={() => {/* handleDelete */ }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><TrashIcon className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition z-10">
              <XMarkIcon className="w-6 h-6" />
            </button>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row p-8 gap-10">
                <div className="w-full md:w-2/5 flex flex-col gap-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Foto Produk</h3>
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="relative group cursor-pointer aspect-square rounded-[2rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview.startsWith('blob') ? imagePreview : `${IMAGE_BASE_URL}${imagePreview}`}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <CloudArrowUpIcon className="w-12 h-12 mb-2" />
                        <span className="text-xs font-bold uppercase">Upload Foto</span>
                      </div>
                    )}
                  </div>
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                </div>

                <div className="w-full md:w-3/5 space-y-5">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Detail Produk</h3>
                  <div>
                    <label className="text-xs font-bold text-gray-700 ml-1">Nama Produk</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition" />
                  </div>

                  {/* Grid 3 Kolom untuk Harga, Stok, dan Kategori */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 ml-1">Harga (Rp)</label>
                      <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 ml-1"> Stok</label>
                      <input type="number" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition" placeholder="" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 ml-1">Kategori</label>
                      <select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition">
                        <option value="">Pilih...</option>
                        {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 ml-1">Deskripsi Singkat</label>
                    <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition resize-none"></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 flex gap-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-gray-400 hover:text-red-500 transition">Batalkan</button>
                <button type="submit" className="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/30 hover:bg-secondary transition active:scale-[0.98]">
                  {editingProduct ? 'Update Data Menu' : 'Simpan & Posting Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;