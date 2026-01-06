import React, { useState } from 'react';
import api from '../lib/axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Mohon Tunggu...',
            text: 'Sedang memverifikasi akunmu',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const res = await api.post('/users/login', { email, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);

            Swal.fire({
                icon: 'success',
                title: 'Login Berhasil!',
                text: res.data.role === 'ADMIN' ? 'Selamat Datang Admin!' : 'Selamat Datang!',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                // Redirect berdasarkan role
                if (res.data.role === 'ADMIN') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            });

        } catch (err) {
            const errorMsg = err.response?.data?.message || "Email atau Password salah";

            Swal.fire({
                icon: 'error',
                title: 'Akses Ditolak',
                text: errorMsg,
                confirmButtonColor: '#b6713c',
                borderRadius: '20px'
            });
        }
    };

    return (
        <div className="min-h-screen font-jakarta bg-[#fdf8f4] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-10 border border-gray-100 text-center">
                <img src="/logo.png" alt="Logo" className="h-20 w-20 rounded-full mx-auto mb-4 border-4 border-primary shadow-lg" />
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat Datang!</h1>
                <p className="text-gray-500 mb-8">Masuk untuk mulai memesan makanan khas Nusantara ala chef Meow.</p>

                <form onSubmit={handleLogin} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 ml-1">Email</label>
                        <input
                            type="email"
                            className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition"
                            placeholder="meow@gmail.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 ml-1">Password</label>
                        <input
                            type="password"
                            className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-secondary transition shadow-lg shadow-primary/30 mt-4">
                        MASUK SEKARANG
                    </button>
                </form>

                <p className="mt-8 text-gray-600">
                    Belum punya akun? <Link to="/register" className="text-primary font-bold hover:underline">Daftar di sini</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;