import React, { useEffect, useState } from 'react';
import './AdminProductsPage.css';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { HttpClientService } from '@/services/httpclient.service';
interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}
const httpClientService = new HttpClientService;
export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const API_URL = 'https://localhost:7083/api/Products';

    // GET İstegi
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await httpClientService.get<Product[]>({ controller: "products" });
            setProducts(data);
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

    // POST - PUT İstegi
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Post
            if (!editingId) {
                const body = { name, stock: Number(stock), price: Number(price) }
                await httpClientService.post({ controller: "products" }, body);

                await fetchProducts();
                setName('');
                setPrice('');
                setStock('');
                toast.success("Ürün başarıyla veritabanına eklendi!");

            } // PUT
            else if (editingId) {
                const body = { id: editingId, name, stock: Number(stock), price: Number(price) }
                await httpClientService.put({ controller: "products" }, body);
                await fetchProducts();
                setEditingId(null);
                setName('');
                setPrice('');
                setStock('');
                toast.success("Ürün başarıyla güncellendi!");
            }
        } catch (error) {
            console.error("İşlem Hatası:", error);
            toast.error(editingId ? "Ürün güncellenirken bir hata oluştu!" : "Ürün eklenirken bir hata oluştu!");
        }
    };

    //delete 
    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete('https://localhost:7083/api/products/' + id);
            await fetchProducts();
            toast.success("Ürün başarıyla silindi!");
        } catch (error) {
            console.error("Hata:", error);
            toast.error("Silme hatası!");
        }
    }
    //update
    const handleEditClick = async (product: Product) => {
        setEditingId(product.id);
        setName(product.name);
        setPrice(product.price.toString());
        setStock(product.stock.toString());
    }
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
                    <button type="submit" className="submit-btn">{editingId ? 'Ürün Güncelle' : 'Ürün Ekle'}</button>
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
                                <button type="button" onClick={() => handleEditClick(product)}>Düzenle</button>
                                <button type="button" onClick={() => handleDelete(product.id)}>Sil</button>


                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </div>
    );
}