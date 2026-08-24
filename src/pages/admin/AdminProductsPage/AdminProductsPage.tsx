import React, { useEffect, useState } from 'react';
import './AdminProductsPage.css';
import toast, { Toaster } from 'react-hot-toast';
import DeleteButton from '@/components/common/DeleteButton/DeleteButton';
import FileUpload, { type FileUploadOptions } from '@/components/common/FileUpload/FileUpload';
import ProductImageModal from "../../../components/common/ProductImageModal/ProductImageModal";
import { HttpClientService } from '@/services/httpclient.service';
import ProductService from '@/services/product.service';
import type { List_Product } from '@/contracts/products/list_product';


const productService = new ProductService(new HttpClientService());

export default function AdminProductsPage() {
    const [products, setProducts] = useState<List_Product[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(5);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const fileUploadOptions: FileUploadOptions = {
        controller: "products",
        action: "upload",
        explanation: "Ürün resimlerini yükleyiniz.",
        accept: ".png, .jpg, .jpeg"
    };

    // GET İstegi
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.read(page, size);

            if (data.products.length === 0 && page > 1) {
                setPage(prev => prev - 1);
                return;
            }
            setProducts(data.products);
            setTotalCount(data.totalCount);

        } catch (error) {
            console.error("GET Hatası:", error);
            toast.error("Ürünler yüklenirken bir hata oluştu!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    // POST - PUT İstegi
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Post
            if (!editingId) {
                const body = { name, stock: Number(stock), price: Number(price) }
                await productService.create(body);
                await fetchProducts();
                setName('');
                setPrice('');
                setStock('');
                toast.success("Ürün başarıyla veritabanına eklendi!");

            } // PUT
            else if (editingId) {
                const body = { id: editingId, name, stock: Number(stock), price: Number(price) }
                await productService.update(body);
                await fetchProducts();
                setEditingId(null);
                setName('');
                setPrice('');
                setStock('');
                toast.success("Ürün başarıyla güncellendi!");
            }
        } catch (error: any) {
            console.error("İşlem Hatası:", error);
            const validationErrors = error.response?.data;
            if (validationErrors && typeof validationErrors === 'object') {
                Object.keys(validationErrors).forEach((key) => {
                    const messages = validationErrors[key];
                    if (Array.isArray(messages)) {
                        messages.forEach((msg: string) => toast.error(msg));
                    }
                });
            } else {
                toast.error(editingId ? "Ürün güncellenirken bir hata oluştu!" : "Ürün eklenirken bir hata oluştu!");
            }
        }
    };
    //update
    const handleEditClick = (product: List_Product) => {
        setEditingId(product.id);
        setName(product.name);
        setPrice(product.price.toString());
        setStock(product.stock.toString());
    }
    return (
        <div className="admin-products-container">
            <Toaster position="top-right" />

            <h2 style={{ color: "#000000" }}>Admin Ürün Yönetimi</h2>

            <FileUpload options={fileUploadOptions} />
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
            </form>
            {loading ? (
                <p style={{ color: "#000000", marginTop: "15px" }}>Ürünler yükleniyor...</p>
            ) : (
                <ul className="admin-product-list">
                    {products.map((product) => (
                        <li key={product.id} className="admin-product-item">
                            <button type="button" onClick={() => setSelectedProductId(product.id)}>Photos</button>
                            <span>
                                <strong>{product.name}</strong> - Stok: {product.stock} Adet ({product.price} TL)
                            </span>
                            <button type="button" onClick={() => handleEditClick(product)}>Düzenle</button>
                            <DeleteButton controller="products" id={product.id} onSuccess={fetchProducts} />
                        </li>
                    ))}

                </ul>
            )}
            <div className="pagination-container">
                <button type="button" disabled={page === 1} onClick={() => setPage(page => page - 1)}>
                    Önceki
                </button>

                <span>
                    Sayfa {page} / {Math.ceil(totalCount / size)}
                </span>

                <button type="button" disabled={page >= Math.ceil(totalCount / size) || totalCount === 0} onClick={() => setPage(page => page + 1)}>
                    Sonraki
                </button>
            </div>
            <ProductImageModal
                isOpen={selectedProductId !== null}
                productId={selectedProductId ?? ""}
                onClose={() => setSelectedProductId(null)}
            />
        </div>
    );
}