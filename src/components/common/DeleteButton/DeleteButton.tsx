import { HttpClientService } from "@/services/httpclient.service";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";

interface DeleteButtonProps {
    id: string;
    controller: string;
    onSuccess: () => void;
}
const httpClientService = new HttpClientService();
export default function DeleteButton({ id, controller, onSuccess }: DeleteButtonProps) {
    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu işlem geri alınamaz!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            background: '#9bbaaa',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'Vazgeç'
        });
        if (result.isConfirmed) {
            try {
                await httpClientService.delete({ controller: controller }, id);
                toast.success("Kayıt başarıyla silindi!");
                onSuccess();
            } catch (error) {
                console.error("Silme hatası: ", error);
                toast.error("Ürün silinirken bir hata oluştu!");
            }
        }

    }
    return (
        <div>
            <button type="button" onClick={handleDelete}>Sil
            </button>
        </div>
    )
}