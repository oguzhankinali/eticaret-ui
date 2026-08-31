import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/client/HomePage/HomePage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage/AdminDashboardPage'
import AdminLayout from './components/AdminLayout/AdminLayout'
import ClientLayout from './components/ClientLayout/ClientLayout'
import ProductsPage from './pages/client/ProductsPage/ProductsPage'
import AboutPage from './pages/client/AboutPage/AboutPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage/AdminOrdersPage'
import AdminProductsPage from './pages/admin/AdminProductsPage/AdminProductsPage'
import NotFoundPage from './pages/client/NotFoundPage/NotFoundPage'
import ProductDetailPage from './pages/client/ProductDetailPage/ProductDetailPage'
import RegisterPage from './pages/client/RegisterPage/RegisterPage'
import LoginPage from './pages/client/LoginPage/LoginPage'
import { AuthProvider } from './context/AuthContext'
import toast, { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute'
import { SignalRService } from './services/signalr.service';
import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    const signalRService = new SignalRService();
    const connection = signalRService.start("https://localhost:7083/product-hub");
    signalRService.on(connection, "receiveProductAddedMessage", (message: string) => {
      toast.success(message, {
        position: "top-right"
      });
    });
  }, [])
  return (

    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>

        <Route element={<ClientLayout username="Oğuzhan" />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />

      </Routes>

    </AuthProvider>
  )
}