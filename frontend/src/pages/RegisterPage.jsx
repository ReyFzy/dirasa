import React, { useState } from 'react';
import api from '../lib/axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      return Swal.fire({
        icon: 'warning',
        title: 'Password Terlalu Pendek',
        text: 'Gunakan minimal 8 karakter demi keamanan.',
        confirmButtonColor: '#b6713c',
        borderRadius: '20px'
      });
    }

    Swal.fire({
      title: 'Memproses Pendaftaran',
      text: 'Mohon tunggu sebentar...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await api.post('/users/register', formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Pendaftaran Berhasil!',
        text: 'Akunmu sudah siap. Silakan login untuk mulai memesan.',
        confirmButtonColor: '#b6713c',
        borderRadius: '20px'
      }).then(() => {
        navigate('/login');
      });

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Pendaftaran Gagal. Email mungkin sudah digunakan.";
      
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mendaftar',
        text: errorMsg,
        confirmButtonColor: '#b6713c',
        borderRadius: '20px'
      });
    }
  };

  return (
    <div className="min-h-screen font-jakarta bg-[#fdf8f4] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-10 border border-gray-100 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Buat Akun Baru</h1>
        <p className="text-gray-500 mb-8">Gabung sekarang dan nikmati promo eksklusif.</p>
        
        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Nama Lengkap</label>
            <input 
              type="text" 
              className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition" 
              placeholder="Contoh: Chef Meow"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Email</label>
            <input 
              type="email" 
              className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition" 
              placeholder="meow@gmail.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition" 
              placeholder="Minimal 8 karakter"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-secondary transition shadow-lg shadow-primary/30 mt-4">
            DAFTAR SEKARANG
          </button>
        </form>
        
        <p className="mt-8 text-gray-600">
          Sudah punya akun? <Link to="/login" className="text-primary font-bold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;