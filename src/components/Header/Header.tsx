import React from 'react'
import { Link } from "react-router-dom"
import './Header.css'
export default function Header(props: { username: string }) {
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

            <div>
                <span style={{ color: '#101011' }}>Hoş geldin, <strong>{props.username}</strong></span>
            </div>


        </header>
    )
}