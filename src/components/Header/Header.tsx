import React from 'react'
import { Link } from "react-router-dom"
import './Header.css'
import { useAuth } from '@/context/AuthContext';

export default function Header(props: { username: string }) {
    const { isAuthenticated, logout } = useAuth();


    return (
        <header className="site-header">
            <div className="header-logo">
                <Link to="/">E-Ticaret Logosu</Link>
            </div>

            <nav className="header-nav">
                <Link to="/" className="nav-link">Ana Sayfa</Link>
                <Link to="/products" className="nav-link">Ürünler</Link>
                <Link to="/about" className="nav-link">Hakkımızda</Link>
            </nav>
            {(isAuthenticated)
                ? <button onClick={logout} className="btn-logout">Çıkış Yap</button>
                : <nav className="auth-links">
                    <Link to="/login" className="nav-link">Giriş Yap</Link>
                    <Link to="/register" className="nav-link">Kayıt ol</Link>
                </nav>}
        </header>
    )
}