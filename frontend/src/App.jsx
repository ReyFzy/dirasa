import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritePage from './pages/FavoritePage';
import OrderPage from './pages/OrderPage';
import DashboardLayout from './layouts/DashboardLayout';
import ManageProducts from './pages/ManageProducts';
import ManageUsers from './pages/ManageUsers';
import ManageCategories from './pages/ManageCategories';
import ManageOrders from './pages/ManageOrders';

function App() {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage favorites={favorites} toggleFavorite={toggleFavorite} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/favorites" element={<FavoritePage favorites={favorites} toggleFavorite={toggleFavorite} />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<ManageUsers />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="orders" element={<ManageOrders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;