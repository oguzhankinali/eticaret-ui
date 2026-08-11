import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './ProductsPage.css'
import axios from 'axios'

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}


export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get("category");
    const [products, setProducts] = useState<Product[]>([]);
    const getProducts = async () => {
        try {
            const response = await axios.get('https://localhost:7083/api/Products');
            setProducts(response.data);
        } catch (error) {
            console.error("Bir hata oluştu.");
        }
    }
    useEffect(() => {
        getProducts();
    }, []);
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
                {products.length > 0 ? (
                    products.map((product) => (
                        <li key={product.id} className="product-card">
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>
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
