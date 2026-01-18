import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen font-jakarta bg-[#fdf8f4] flex flex-col items-center justify-center px-6 text-center">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-secondary rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10">
                <h1 className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-gray-900 opacity-10">
                    404
                </h1>
                
                <div className="-mt-16 md:-mt-24 space-y-6">
                    <div className="inline-block px-4 py-1 bg-red-100 text-red-500 rounded-full font-bold text-xs tracking-widest uppercase mb-4">
                        Oops! Menunya gada disini
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                        HALAMAN <span className="text-primary italic">HILANG</span> <br />DARI MEJA.
                    </h2>
                    
                    <p className="text-gray-500 text-lg max-w-md mx-auto font-medium leading-relaxed">
                        Kayaknya Chef Meow salah masukkin resep. Halaman yang kamu cari sudah dipindahkan atau tidak pernah ada.
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-secondary transition-all shadow-xl shadow-primary/20 hover:-translate-y-1"
                        >
                            KEMBALI KE BERANDA
                        </button>
                        
                        <button 
                            onClick={() => navigate(-1)}
                            className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-4 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all"
                        >
                            HALAMAN SEBELUMNYA
                        </button>
                    </div>
                </div>

                <p className="mt-20 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                    © 2026 DIRASA · Customer Support
                </p>
            </div>
        </div>
    );
};

export default NotFound;