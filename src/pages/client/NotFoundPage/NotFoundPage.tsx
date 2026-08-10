import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            color: '#333',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '96px', margin: 20, color: '#e74c3c' }}>404</h1>
            <h2 style={{ fontSize: '28px', margin: '20px 0', color: '#2c3e50' }}>Sayfa Bulunamadı</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
            <Link to="/" style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold'
            }}>
                Ana Sayfaya Dön
            </Link>
        </div>
    )
}