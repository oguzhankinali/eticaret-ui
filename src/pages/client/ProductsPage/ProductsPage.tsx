import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './ProductsPage.css'
import { HttpClientService } from '../../../services/httpclient.service';
interface ProductImage {
    id: string;
    fileName: string;
    path: string;
}
interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    productImageFiles?: ProductImage[];
}
interface PaginatedProductsResponse {
    totalCount: number;
    products: Product[];
}
const httpClientService = new HttpClientService();

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get("category");
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(8);
    const [totalCount, setTotalCount] = useState<number>(0);

    const getProducts = async () => {
        try {
            const data = await httpClientService.get<PaginatedProductsResponse>({ controller: "products", queryString: `page=${page}&size=${size}` });
            setProducts(data.products);
            setTotalCount(data.totalCount);

        } catch (error) {
            console.error("Bir hata oluştu.");
        }
    }
    useEffect(() => {
        getProducts();
    }, [page]);
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
                            <img
                                src={
                                    (product.productImageFiles && product.productImageFiles.length > 0)
                                        ? `https://eticaretdosya.blob.core.windows.net/${product.productImageFiles[0].path}/${product.productImageFiles[0].fileName}`
                                        : "https://via.placeholder.com/150"
                                }
                                alt={product.name}
                                className="product-image"
                            />
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>
                            <Link to={`/products/${product.id}`}>Ürün detayı</Link>
                        </li>
                    ))
                ) : (
                    <p>Bu kategoride ürün bulunamadı.</p>
                )}
            </ul>
            <div className="client-pagination-container">
                <button disabled={page === 1} type="button" onClick={() => setPage(page => page - 1)}>Önceki</button>
                <span>Sayfa {page} / {Math.ceil(totalCount / size) || 1} </span>
                <button disabled={page >= Math.ceil(totalCount / size) || totalCount === 0} type="button" onClick={() => setPage(page => page + 1)}>Sonraki</button>

            </div>

        </div>
    )
}
