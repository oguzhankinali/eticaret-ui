import { HttpClientService } from "@/services/httpclient.service";
import { useEffect, useState } from "react";
import "./ProductImageModal.css";
import FileUpload from "../FileUpload/FileUpload";

interface ProductImageModalProps {
    isOpen: boolean,
    productId: string,
    onClose: () => void
}
interface ProductImage {
    id: string
    path: string
    fileName: string
}
const httpClientService = new HttpClientService();
export default function ProductImageModal({ isOpen, productId, onClose }: ProductImageModalProps) {
    const [images, setImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchImages = async () => {
        try {
            console.log("1. fetchImages tetiklendi, productId:", productId);
            setLoading(true);
            const photos = await httpClientService.get<ProductImage[]>({ controller: "products", action: `GetProductImages/${productId}` });
            setImages(photos);
        } catch (error) {
            console.log("2. fetchImages tetiklendi, productId:", productId);
            console.error(error);
        }
        finally {
            console.log("3. fetchImages tetiklendi, productId:", productId);
            setLoading(false);
        }
    }
    const handleDeleteImages = async (imageId: string) => {
        await httpClientService.delete<any>({ controller: "products", action: "DeleteProductImage", queryString: `imageId=${imageId}` }, `${productId}`);
        setImages(images.filter(img => img.id !== imageId));
    }
    useEffect(() => {
        if (isOpen && productId) {
            fetchImages();
        }
    }, [isOpen, productId])

    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <div className="modal-header">
                    <h3>Ürün Fotoğrafları</h3>
                    <button type="button" className="modal-close-btn" onClick={onClose}>X</button>
                </div>

                <div className="image-grid">
                    {loading ? <p>Fotoğraflar yükleniyor...</p> : (
                        <>
                            {images.length === 0 ? <p>Bu ürüne ait henüz fotoğraf bulunmamaktadır.</p> : (
                                <>
                                    {images.map((image) => (
                                        <div key={image.id} className="image-card">
                                            <img src={`https://eticaretdosya.blob.core.windows.net/${image.path}/${image.fileName}`} alt={image.fileName} />
                                            <p>{image.fileName}</p>
                                            <button className="btn-delete-image" type="button" onClick={() => handleDeleteImages(image.id)}>Sil</button>

                                        </div>
                                    ))}
                                </>)}
                        </>)

                    }

                </div>
                <div className="modal-upload-area">
                    <FileUpload options={{
                        controller: "products",
                        action: "Upload",
                        queryString: `id=${productId}`,
                        explanation: "Fotoğrafları buraya sürükleyin veya seçin."
                    }} />
                </div>

            </div>
        </div>
    )
}