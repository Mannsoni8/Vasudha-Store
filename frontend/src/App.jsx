import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/common';

import Navbar       from './components/layout/Navbar';
import Footer       from './components/layout/Footer';
import AdminLayout  from './components/admin/AdminLayout';

import HomePage          from './pages/HomePage';
import ProductsPage      from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage          from './pages/CartPage';
import CheckoutPage      from './pages/CheckoutPage';
import LoginPage         from './pages/LoginPage';
import OrdersPage        from './pages/OrdersPage';

import AdminDashboard   from './components/admin/AdminDashboard';
import AdminProducts    from './components/admin/AdminProducts';
import AdminProductForm from './components/admin/AdminProductForm';
import AdminOrders      from './components/admin/AdminOrders';
import AdminUsers       from './components/admin/AdminUsers';

function MainLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const hideNavbar = pathname === '/login';
  if (isAdmin) return null;

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="min-h-[80vh]">
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/products"   element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/cart"       element={<CartPage />} />
          <Route path="/checkout"   element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders"     element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="*"           element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl mb-4">🌸</p>
      <h1 className="font-display text-4xl text-maroon-900 font-bold mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: 'Lato, sans-serif', fontSize: '14px' },
              success: { iconTheme: { primary: '#8B1A2E', secondary: '#fff' } },
            }}
          />

          <Routes>
            {/* Admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index              element={<AdminDashboard />} />
              <Route path="products"    element={<AdminProducts />} />
              <Route path="products/new"        element={<AdminProductForm />} />
              <Route path="products/edit/:id"   element={<AdminProductForm />} />
              <Route path="orders"      element={<AdminOrders />} />
              <Route path="users"       element={<AdminUsers />} />
            </Route>

            {/* Public routes */}
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
