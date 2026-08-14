import { HttpClientService } from "@/services/httpclient.service";
import toast from "react-hot-toast";

interface DeleteButtonProps {
    id: string;
    controller: string;
    onSuccess: () => void;
}
const httpClientService = new HttpClientService();
export default function DeleteButton({ id, controller, onSuccess }: DeleteButtonProps) {
    const handleDelete = async () => {
        try {
            await httpClientService.delete({ controller: controller }, id);
            toast.success("Ürün başarıyla silindi!");
            onSuccess();
        } catch (error) {
            console.error("Silme hatası: ", error);
            toast.error("Ürün silinirken bir hata oluştu!");
        }
    }
    return (
        <div>
            <button type="button" onClick={handleDelete}>Sil
            </button>
        </div>
    )
}