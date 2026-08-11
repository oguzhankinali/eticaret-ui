import React, { useEffect, useState } from 'react'
import './AdminProductsPage.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminProductsPage() {
    // 1. State Tanımlamaları
    const [products, setProducts] = useState([])
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [loading, setLoading] = useState(false);

    // 2. Veritabanından Ürünleri Çeken Fonksiyon
    const fetchProducts = () => {
        setLoading(true);
        fetch('https://localhost:7083/api/Products')
            .then(res => {
                if (!res.ok) throw new Error("API yanıt vermedi.");
                return res.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("GET Hatası:", err);
                toast.error("Ürünler yüklenirken bir hata oluştu!");
                setLoading(false);
            });
    }

    // 3. Sayfa İlk Açıldığında Verileri Getir
    useEffect(() => {
        fetchProducts();
    }, [])

    // 4. Form Gönderildiğinde Ürün Ekleyen Fonksiyon
    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const newProduct = {
            name,
            stock: Number(stock),
            price: Number(price),
        }

        fetch('https://localhost:7083/api/Products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        })
            .then(res => {
                if (res.ok) {
                    fetchProducts();
                    setName('');
                    setPrice('');
                    setStock('');
                    toast.success("Ürün başarıyla veritabanına eklendi!", {
                        position: "top-right",
                        autoClose: 3000
                    });
                } else {
                    toast.error("Ürün eklenirken bir hata oluştu!");
                }
            })
            .catch(err => {
                console.error("POST Hatası:", err);
                toast.error("Sunucuya bağlanılamadı!");
            });
    }

    // 5. Ekran Çıktısı (JSX)
    return (
        <div className="admin-products-container">
            {/* Bildirim Panosu */}
            <ToastContainer aria-label="notification-container" />

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

                {/* Yüklenme Durumuna Göre Koşullu Ekran Çizimi */}
                {loading ? (
                    <p style={{ color: "#000000", marginTop: "15px" }}>Ürünler yükleniyor...</p>
                ) : (
                    <ul className="admin-product-list">
                        {products.map((product: any) => (
                            <li key={product.id} className="admin-product-item">
                                <span><strong>{product.name}</strong> - Stok: {product.stock} Adet ({product.price} TL)</span>
                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </div>
    )
}