import { type Create_User } from "../../../services/user.service"
import { useState } from "react";
import { HttpClientService } from "@/services/httpclient.service";
import { UserService } from "../../../services/user.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../LoginPage/LoginPage.css";
const userService = new UserService(new HttpClientService());

export default function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Create_User>({
        nameSurname: "",
        userName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (formData.password !== formData.passwordConfirm) {
                toast.error("Şifreler eşleşmiyor");
                return;
            }
            const response = await userService.create(formData);
            if (response.succeeded) {
                toast.success(response.message);
                navigate("/login");
            }
            else {

            }
        } catch (e) {
            toast.error("Kayıt işlemi başarısız oldu! Şifre kurallarını veya bilgileri kontrol ediniz.");
        }

    }
    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Kayıt Ol</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input name="nameSurname" value={formData.nameSurname} type="text" onChange={handleChange} placeholder="Ad Soyad"></input>
                    </div>
                    <div className="form-group">
                        <input name="userName" value={formData.userName} type="text" onChange={handleChange} placeholder="Kullanıcı Adı"></input>
                    </div>
                    <div className="form-group" >
                        <input name="email" value={formData.email} type="email" onChange={handleChange} placeholder="Email"></input>
                    </div>
                    <div className="form-group">
                        <input name="password" value={formData.password} type="password" onChange={handleChange} placeholder="Şifre"></input>
                    </div>
                    <div className="form-group">
                        <input name="passwordConfirm" value={formData.passwordConfirm} type="password" onChange={handleChange} placeholder="Şifre tekrarı"></input>
                    </div>
                    <button className="btn-submit" type="submit">Kayıt ol</button>
                </form>
            </div>

        </div>
    )
}