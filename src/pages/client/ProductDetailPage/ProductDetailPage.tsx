import { HttpClientService } from '../../../services/httpclient.service';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}
const httpClientService = new HttpClientService();
export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [product, setProduct] = useState<Product | null>(null);
    const getProduct = async () => {
        try {
            const data = await httpClientService.get<Product>({ controller: "products", action: id });
            setProduct(data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (id) {
            getProduct();
        }
    }, [id]);
    const navigate = useNavigate()
    return (
        <div className="detail-container">
            {product ?
                <div>
                    <h2>Ürün Detay Sayfası</h2>
                    <p>Ürün İsmi: <strong>{product.name}</strong></p>
                    <p>Stokta Bulunan: <strong>{product.stock}</strong></p>
                    <p>Ürün Fiyatı: <strong>{product.price}</strong></p>

                </div>
                : <p>Ürün bulunamadı</p>
            }

            <div className="button-group">
                <button
                    onClick={() => navigate('/products')}
                    className="btn btn-primary"
                >
                    ← Ürün Listesine Dön
                </button>

                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-secondary"
                >
                    Geri Git
                </button>
            </div>
        </div>
    )
}

