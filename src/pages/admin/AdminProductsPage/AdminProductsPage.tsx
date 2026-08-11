import React, { useEffect, useState } from 'react';
import './AdminProductsPage.css';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = 'https://localhost:7083/api/Products';

    // GET İstegi
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setProducts(response.data);
        } catch (error) {
            console.error("GET Hatası:", error);
            toast.error("Ürünler yüklenirken bir hata oluştu!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // POST İstegi
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct = {
            name,
            stock: Number(stock),
            price: Number(price),
        };

        try {
            const response = await axios.post(API_URL, newProduct);

            if (response.status === 200 || response.status === 201) {
                await fetchProducts();
                setName('');
                setPrice('');
                setStock('');
                toast.success("Ürün başarıyla veritabanına eklendi!");
            }
        } catch (error) {
            console.error("POST Hatası:", error);
            toast.error("Ürün eklenirken bir hata oluştu!");
        }
    };

    return (
        <div className="admin-products-container">
            <Toaster position="top-right" />

            <h2 style={{ color: "#000000" }}>Admin Ürün Yönetimi</h2>

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label>Ürün Adı:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Ürün Fiyatı:</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Stok Adedi:</label>
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
                <div>
                    <button type="submit" className="submit-btn">Ürün Ekle</button>
                </div>

                {loading ? (
                    <p style={{ color: "#000000", marginTop: "15px" }}>Ürünler yükleniyor...</p>
                ) : (
                    <ul className="admin-product-list">
                        {products.map((product: any) => (
                            <li key={product.id} className="admin-product-item">
                                <span>
                                    <strong>{product.name}</strong> - Stok: {product.stock} Adet ({product.price} TL)
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </div>
    );
}