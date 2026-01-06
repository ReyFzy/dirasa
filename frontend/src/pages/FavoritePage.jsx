import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import api from '../lib/axios';

const fetcher = (url) => api.get(url).then((res) => res.data);

const FavoritePage = ({ favorites, toggleFavorite, addToCart }) => {
  const navigate = useNavigate();
  const { data: products } = useSWR('/products', fetcher);

  const favoriteProducts = products?.filter(p => favorites.includes(p.id));

  return (
    <div className="font-jakarta min-h-screen bg-[#fdf8f4]">
      <nav className="p-6 md:px-20 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full" />
          <div className="text-xl font-black text-primary">DIRASA.</div>
        </div>
        <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-500 hover:text-primary transition"> KEMBALI KE MENU</button>
      </nav>

      <div className="px-6 md:px-20 py-12">
        <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Menu <span className="text-primary italic">Favoritmu.</span></h1>
        
        {favoriteProducts?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {favoriteProducts.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative">
                <button 
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-8 right-8 z-10 p-2 bg-red-50 rounded-full text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
                <div className="h-40 bg-gray-50 rounded-2xl mb-4 flex items-center justify-center font-black text-gray-200 opacity-30">IMAGE</div>
                <h4 className="font-black text-lg">{item.name}</h4>
                <p className="text-2xl font-black text-primary mt-2">Rp {item.price.toLocaleString()}</p>
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-primary transition"
                >
                  TAMBAH KE KERANJANG
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-inner border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase tracking-widest">Belum ada menu favorit.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritePage;