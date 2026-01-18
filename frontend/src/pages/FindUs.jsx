import React from 'react';
import { useNavigate } from 'react-router-dom';

const FindUs = () => {
    const navigate = useNavigate();

    return (
        <div className="font-jakarta bg-white min-h-screen">
            <nav className="px-6 md:px-20 py-6 border-b border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="text-2xl font-black text-primary tracking-tighter">DIRASA.</div>
                </div>
                <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-500 hover:text-primary transition">
                    KEMBALI KE BERANDA
                </button>
            </nav>

            <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-primary font-black tracking-widest text-sm uppercase italic mb-2">Location</h2>
                            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">MAMPIR KE <br/>DAPUR KAMI.</h1>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Alamat Utama</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">Jl. Soekarno-Hatta No. 378, <br/>Kota Bandung, Jawa Barat 40235</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Jam Operasional</h4>
                                    <p className="text-gray-500 text-sm">Setiap Hari: 10.00 - 22.00 WIB</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-[#fdf8f4] rounded-[2rem] border border-primary/10">
                            <p className="text-primary font-bold italic mb-2 text-sm">"Chef Meow selalu menunggu kehadiranmu untuk mencicipi resep rahasia hari ini."</p>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">— Chef Aseli Dirasa</span>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl group-hover:bg-primary/20 transition duration-500"></div>
                        <div className="relative h-[500px] w-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl">
                            <iframe 
                                title="Google Maps Dirasa"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.5173065764443!2d107.59844772499677!3d-6.948139643052069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6279d52ed8b%3A0xfbc31838ba12ddbf!2sUniversitas%20Teknologi%20Bandung!5e0!3m2!1sid!2sid!4v1768737799857!5m2!1sid!2sid" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FindUs;