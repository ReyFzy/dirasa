import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import api from '../lib/axios';
import Swal from 'sweetalert2';

import rendang from "../assets/rendang.jfif";

const fetcher = (url) => api.get(url).then((res) => res.data);

const IMAGE_BASE_URL = "http://localhost:5000/uploads/products/";

const LandingPage = () => {
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [role, setRole] = useState(null);

    const { data: products } = useSWR('/products', fetcher);
    const { data: categories } = useSWR('/categories', fetcher);

    const { data: dbFavorites, mutate: mutateFavorites } = useSWR(
        isLoggedIn ? '/favorites' : null,
        fetcher
    );

    const { data: dbCartItems, mutate: mutateCart } = useSWR(
        isLoggedIn ? '/cart' : null,
        fetcher
    );

    const cartItems = dbCartItems?.map(item => ({
        ...item.product,
        cartItemId: item.id,
        qty: item.qty
    })) || [];

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        setIsLoggedIn(!!token);
        setRole(storedRole);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        if (dbFavorites && Array.isArray(dbFavorites)) {
            const favIds = dbFavorites.map(fav => fav.productId);
            setFavorites(favIds);
        }
    }, [dbFavorites]);

    const checkAuth = (action) => {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                title: 'Akses Dibatasi',
                text: `Silakan login terlebih dahulu untuk ${action}!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#b6713c',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Login Sekarang',
                cancelButtonText: 'Nanti aja',
                borderRadius: '20px'
            }).then((result) => {
                if (result.isConfirmed) navigate('/login');
            });
            return false;
        }
        return true;
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout?',
            text: "Kamu yakin ingin keluar?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#b6713c',
            cancelButtonColor: '#6e7881',
            confirmButtonText: 'Ya, Logout',
            borderRadius: '20px'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                navigate(0);
            }
        });
    };

    const toggleFavorite = async (product) => {
        if (!checkAuth('menambah favorit')) return;

        try {
            await api.post('/favorites/toggle', { productId: product.id });
            mutateFavorites();

            const isCurrentlyFavorite = favorites.includes(product.id);
            if (!isCurrentlyFavorite) {
                setFavorites([...favorites, product.id]);
                Swal.fire({ title: '❤️ Favorit!', text: `${product.name} disimpan.`, icon: 'success', timer: 1500, showConfirmButton: false });
            } else {
                setFavorites(favorites.filter(id => id !== product.id));
                Swal.fire({ title: 'Dihapus', text: `${product.name} dihapus.`, icon: 'info', timer: 1500, showConfirmButton: false });
            }
        } catch (error) {
            Swal.fire('Gagal!', 'Gagal sinkronisasi favorit.', 'error');
        }
    };

    const addToCart = async (product) => {
        if (!checkAuth('menambah ke keranjang')) return;

        try {
            await api.post('/cart', {
                productId: product.id,
                qty: 1
            });

            mutateCart();

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
            });
            Toast.fire({ icon: 'success', title: `${product.name} masuk keranjang!` });
        } catch (error) {
            Swal.fire('Gagal!', 'Gagal menambahkan ke keranjang.', 'error');
        }
    };

    const clearCart = async () => {
        try {
            for (const item of dbCartItems) {
                await api.delete(`/cart/${item.id}`);
            }
            mutateCart();
        } catch (error) {
            console.error("Gagal mengosongkan keranjang");
        }
    };

    const handleViewCart = () => {
        if (!checkAuth('melihat keranjang')) return;

        if (cartItems.length === 0) {
            Swal.fire({
                title: 'Keranjang Kosong',
                text: 'Mulai belanja untuk mengisi keranjangmu!',
                icon: 'info',
                confirmButtonColor: '#b6713c'
            });
            return;
        }

        const totalHarga = cartItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

        const listHtml = cartItems.map((item, index) => `
            <tr class="text-sm border-b border-gray-100 font-jakarta">
                <td class="py-3 text-center font-bold text-gray-400">${index + 1}</td>
                <td class="py-3 text-left">
                    <b class="text-gray-900 block leading-tight">${item.name}</b>
                    <span class="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">${item.qty} Porsi x Rp ${item.price.toLocaleString()}</span>
                </td>
                <td class="py-3 text-right font-black text-primary text-sm">
                    Rp ${(item.price * item.qty).toLocaleString()}
                </td>
            </tr>
        `).join('');

        Swal.fire({
            title: '<span class="font-black uppercase tracking-tighter text-2xl">KONFIRMASI PESANAN</span>',
            html: `
                <div class="max-h-60 overflow-y-auto px-2 mb-4 custom-scrollbar">
                    <table class="w-full mb-2">
                        <thead>
                            <tr class="text-[10px] uppercase tracking-widest text-gray-400 border-b-2 border-gray-50">
                                <th class="pb-2 w-10">No</th>
                                <th class="pb-2 text-left">Menu</th>
                                <th class="pb-2 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${listHtml}
                        </tbody>
                    </table>
                </div>

                <div class="grid grid-cols-3 gap-3 mb-4 text-left">
                    <div class="col-span-1">
                        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">No. Meja</label>
                        <input type="number" id="table-number" 
                            class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-primary/20 text-center" 
                            placeholder="00">
                    </div>
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Catatan (Notes)</label>
                        <input type="text" id="order-note" 
                            class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                            placeholder="Contoh: Pisah sambal...">
                    </div>
                </div>

                <div class="flex justify-between items-center p-4 bg-gray-900 rounded-2xl shadow-lg shadow-gray-200">
                    <div class="text-left">
                        <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Bayar</span>
                        <span class="text-2xl font-black text-white tracking-tighter">Rp ${totalHarga.toLocaleString()}</span>
                    </div>
                </div>
            `,
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'CHECKOUT',
            denyButtonText: 'KOSONGKAN',
            cancelButtonText: 'KEMBALI',
            confirmButtonColor: '#b6713c',
            denyButtonColor: '#6e7881',
            borderRadius: '30px',
            preConfirm: () => {
                const tableNumber = document.getElementById('table-number').value;
                const note = document.getElementById('order-note').value;

                if (!tableNumber) {
                    Swal.showValidationMessage('Mohon isi nomor meja!');
                    return false;
                }
                return { tableNumber, note };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    Swal.showLoading();
                    const payload = {
                        tableNumber: result.value.tableNumber,
                        note: result.value.note,
                        totalPrice: totalHarga,
                        items: cartItems.map(item => ({
                            productId: item.id,
                            qty: item.qty,
                            price: item.price
                        }))
                    };

                    const response = await api.post('/orders/checkout', payload);
                    if (response.status === 200 || response.status === 201) {
                        await clearCart();
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'PESANAN DITERIMA!',
                            text: `Meja ${result.value.tableNumber}, pesananmu sedang dimasak Chef Meow!`,
                            confirmButtonColor: '#b6713c'
                        });
                    }
                } catch (error) {
                    const errorMsg = error.response?.data?.message || error.response?.data?.error || "Gagal checkout";
                    Swal.fire('Gagal!', errorMsg, 'error');
                }
            } else if (result.isDenied) {
                await clearCart();
                Swal.fire('Dikosongkan!', 'Keranjang belanja telah dibersihkan.', 'success');
            }
        });
    };

    const filteredProducts = products?.filter(p => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'favorite') return favorites.includes(p.id);
        return p.categoryId === selectedCategory;
    });

    return (
        <div className="font-jakarta bg-white text-gray-900 scroll-smooth">
            {/* --- NAVBAR --- */}
            <nav className="flex justify-between items-center px-6 md:px-20 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/logo.png" alt="Logo" className="h-12 w-12 rounded-full object-cover border-2 border-primary hover:rotate-12 transition-transform" />
                    <div className="text-2xl font-black text-primary tracking-tighter">DIRASA.</div>
                </div>

                <div className="hidden md:flex gap-10 font-bold text-xs uppercase tracking-widest text-gray-600">
                    <a href="#menu" className="hover:text-primary transition">Our Menu</a>
                    <a href="#" className="hover:text-primary transition">Special Promo</a>
                    <a href="#" className="hover:text-primary transition">Find Us</a>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={handleViewCart} className="relative group mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700 group-hover:text-primary transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-bounce">
                                {cartItems.reduce((acc, curr) => acc + curr.qty, 0)}
                            </span>
                        )}
                    </button>

                    {isLoggedIn ? (
                        <div className="flex gap-2">
                            {role === 'ADMIN' && (
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-secondary transition text-sm shadow-md"
                                >
                                    DASHBOARD
                                </button>
                            )}

                            <button onClick={() => navigate('/orders')} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition text-sm">
                                PESANAN SAYA
                            </button>

                            <button onClick={handleLogout} className="border-2 border-primary text-primary px-6 py-2 rounded-full font-bold hover:bg-primary hover:text-white transition text-sm">
                                LOGOUT
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')} className="bg-primary text-white px-8 py-2 rounded-full font-bold hover:bg-secondary transition shadow-lg shadow-primary/20 text-sm">
                            LOGIN
                        </button>
                    )}
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative overflow-hidden bg-[#fdf8f4] px-6 md:px-20 py-20 flex flex-col md:flex-row items-center justify-between min-h-[80vh]">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-20"></div>
                <div className="relative z-10 flex-1 space-y-8">
                    <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-xs tracking-widest uppercase">
                        Olahan nusantara ala chef meow
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black leading-[0.9] text-gray-900">
                        SATU RASA <br /> <span className="text-primary italic">DIRASA.</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-lg leading-relaxed font-medium">
                        Dibuat dengan cinta dan resep rahasia chef meow. Setiap gigitan adalah petualangan nusantara yang tak terlupakan.
                    </p>
                    <div className="flex gap-4">
                        <a href="#menu" className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-secondary transition-all hover:shadow-2xl hover:-translate-y-1">
                            PESAN SEKARANG
                        </a>
                    </div>
                </div>
                <div className="relative z-10 flex-1 mt-12 md:mt-0 flex justify-center text-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition"></div>
                        <img src={rendang} alt="Hero" className="relative w-72 h-72 md:w-[450px] md:h-[450px] object-cover rounded-[4rem] shadow-2xl border-8 border-white rotate-3 hover:rotate-0 transition-transform duration-500" />
                    </div>
                </div>
            </section>

            {/* --- MENU SECTION --- */}
            <section id="menu" className="px-6 md:px-20 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-2">
                        <h2 className="text-primary font-black tracking-widest text-sm uppercase italic">Exploration</h2>
                        <h3 className="text-5xl font-black text-gray-900">DAFTAR MENU.</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        <button onClick={() => setSelectedCategory('all')} className={`px-8 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${selectedCategory === 'all' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                            SEMUA
                        </button>
                        <button onClick={() => setSelectedCategory('favorite')} className={`px-8 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${selectedCategory === 'favorite' ? 'bg-red-500 text-white shadow-xl shadow-red-200' : 'bg-red-50 text-red-400 hover:bg-red-100'}`}>
                            ❤️ FAVORIT ({favorites.length})
                        </button>
                        {categories?.map((cat) => (
                            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-8 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${selectedCategory === cat.id ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                {cat.name.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {filteredProducts?.length > 0 ? (
                        filteredProducts.map((item) => (
                            <div key={item.id} className="group relative bg-white rounded-3xl p-5 border border-gray-100 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(182,113,60,0.15)]">
                                <button onClick={() => toggleFavorite(item)} className="absolute top-8 right-8 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:scale-110 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} fill={favorites.includes(item.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>

                                <div className="relative h-56 bg-gray-50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
                                    {/* LOGIKA FOTO: Cek jika ada item.image */}
                                    {item.image ? (
                                        <img
                                            src={`${IMAGE_BASE_URL}${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <span className="text-gray-200 font-black text-4xl opacity-40 select-none uppercase">DIRASA.</span>
                                    )}

                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-[10px] font-black text-primary uppercase tracking-tighter">
                                        {item.category?.name}
                                    </div>
                                </div>

                                <h4 className="text-xl font-black text-gray-900 group-hover:text-primary transition">{item.name}</h4>
                                <p className="text-gray-400 text-sm font-medium line-clamp-2 italic">Dibuat fresh dengan bahan pilihan terbaik.</p>

                                <div className="mt-8 flex justify-between items-center">
                                    <div>
                                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harga</span>
                                        <span className="text-2xl font-black text-gray-900 tracking-tighter">Rp {item.price.toLocaleString()}</span>
                                    </div>
                                    <button onClick={() => addToCart(item)} className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-primary transition-all shadow-xl group-hover:scale-110 duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold italic tracking-widest uppercase">
                                {selectedCategory === 'favorite' ? 'Belum ada menu favorit' : 'Memuat menu lezat...'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-gray-900 text-white px-6 md:px-20 py-16 text-center md:text-left">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Logo Footer" className="h-10 w-10 rounded-full" />
                            <div className="text-2xl font-black text-white tracking-tighter">DIRASA.</div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                            Membawa kehangatan dapur ke meja makanmu sejak hari ini. Rasa autentik, harga terjangkau.
                        </p>
                    </div>
                    <div className="space-y-4 text-sm">
                        <h5 className="font-black tracking-widest uppercase text-primary">Quick Links</h5>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white">Terms of Services</a></li>
                            <li><a href="#" className="hover:text-white">Contact Us</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h5 className="font-black tracking-widest uppercase text-primary">Social Media</h5>
                        <div className="flex justify-center md:justify-start gap-4">
                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary transition cursor-pointer font-bold text-xs">IG</div>
                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary transition cursor-pointer font-bold text-xs">FB</div>
                        </div>
                    </div>
                </div>
                <p className="pt-8 text-xs text-gray-500 font-bold tracking-widest uppercase text-center">© 2026 DIRASA BY KOKI KUCING. ALL RIGHTS RESERVED.</p>
            </footer>
        </div>
    );
};

export default LandingPage;