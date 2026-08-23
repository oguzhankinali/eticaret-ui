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

export default function App() {
  return (
    <Routes>

      <Route element={<ClientLayout username="Oğuzhan" />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}