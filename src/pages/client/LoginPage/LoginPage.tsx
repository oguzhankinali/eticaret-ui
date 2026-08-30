import type { Login_User } from "@/contracts/users/login_user"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import { HttpClientService } from "@/services/httpclient.service";
import toast from "react-hot-toast";
import "./LoginPage.css";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { AuthService } from "@/services/auth.service";

const authService = new AuthService(new HttpClientService());

export default function LoginPage() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [formData, setFormData] = useState<Login_User>({
        usernameOrEmail: "",
        password: ""
    });

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = await authService.login(formData);
            auth.login(token);
            toast.success("Giriş başarılı!");
            navigate("/");
        } catch (e) {
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
        <div className="login-container">
            <div className="login-card">
                <h2>Giriş Yap</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input name="usernameOrEmail" value={formData.usernameOrEmail} onChange={handleChange} type="text" placeholder="Kullanıcı Adı veya Email"></input>
                    </div>
                    <div className="form-group">
                        <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Şifre"></input>
                    </div>
                    <button className="btn-submit">Giriş yap</button>
                </form>
                <p style={{ color: 'red', paddingTop: 20 }}> Henüz Üye Değil Misiniz? <Link to="/register" style={{ color: 'darkmagenta' }} >Kayıt olun</Link></p>

                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        if (credentialResponse.credential) {
                            const token = await authService.GoogleLogin({ idToken: credentialResponse.credential });
                            if (token) {
                                auth.login(token);
                                toast.success("Google ile giriş başarılı!");
                                navigate("/");
                            }
                        }
                    }}
                    onError={() => {
                        toast.error("Google ile giriş başarısız oldu.");
                    }}
                />
            </div>
        </div>
    )
}