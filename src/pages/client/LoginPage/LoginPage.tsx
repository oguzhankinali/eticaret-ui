import type { Login_User } from "@/contracts/users/login_user"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { UserService } from "../../../services/user.service";
import { HttpClientService } from "@/services/httpclient.service";
import toast from "react-hot-toast";

const userService = new UserService(new HttpClientService());

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Login_User>({
        usernameOrEmail: "",
        password: ""
    });

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await userService.login(formData);
            localStorage.setItem("accessToken", response.accessToken);
            toast.success("Giriş başarılı!");
            navigate("/");
        } catch (error) {
            toast.error("Kullanıcı adı veya şifre hatalı!");
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <input name="usernameOrEmail" value={formData.usernameOrEmail} onChange={handleChange} type="text" placeholder="Kullanıcı Adı veya Email"></input>
                <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Şifre"></input>
                <button>Giriş yap</button>
            </form>
        </>
    )
}