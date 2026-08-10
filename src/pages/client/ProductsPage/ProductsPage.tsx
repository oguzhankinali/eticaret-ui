import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './ProductsPage.css'

const products = [
    { id: '1', name: 'Kablosuz Kulaklık', category: 'elektronik', price: '1200 TL' },
    { id: '2', name: 'Mekanik Klavye', category: 'elektronik', price: '2500 TL' },
    { id: '3', name: 'Deri Cüzdan', category: 'aksesuar', price: '450 TL' },
    { id: '4', name: 'Güneş Gözlüğü', category: 'aksesuar', price: '850 TL' }
]

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get("category");
    const filteredProducts = selectedCategory ? products.filter(p => p.category === selectedCategory) : products;
    return (
        <div className="products-container">

            <h2>Tüm Ürünler</h2>
            <div className="filter-group">

                <button
                    className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
                    onClick={() => setSearchParams({})}>
                    Tümü </button>

                <button
                    className={`filter-btn ${selectedCategory === 'elektronik' ? 'active' : ''}`}
                    onClick={() => setSearchParams({ category: 'elektronik' })}>
                    Elektronik</button>

                <button
                    className={`filter-btn ${selectedCategory === 'aksesuar' ? 'active' : ''}`}
                    onClick={() => setSearchParams({ category: 'aksesuar' })}>Aksesuar </button>
            </div>
            <ul className="product-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <li key={product.id} className="product-card">
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>
                            <p>Kategori: {product.category}</p>
                            <Link to={`/products/${product.id}`}>Ürün detayı</Link>
                        </li>
                    ))
                ) : (
                    <p>Bu kategoride ürün bulunamadı.</p>
                )}
            </ul>

        </div>
    )
}
