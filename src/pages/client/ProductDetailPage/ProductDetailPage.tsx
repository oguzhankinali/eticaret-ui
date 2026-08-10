import { useNavigate, useParams } from "react-router-dom"

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    return (
        <div className="detail-container">
            <h2>Ürün Detay Sayfası</h2>
            <p>Şu an incelenen ürünün ID değeri: <strong>{id}</strong></p>

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

