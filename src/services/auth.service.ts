import type { Login_User } from "@/contracts/users/login_user";
import type { HttpClientService } from "./httpclient.service";
import type { Login_User_Response } from "@/contracts/users/login_user_response";
import type { Token } from "@/contracts/token/token";

export class AuthService {

    private httpClientService: HttpClientService;
    constructor(httpClientService: HttpClientService) {
        this.httpClientService = httpClientService;
    }

    async login(user: Login_User): Promise<Token> {
        let response: Login_User_Response = await this.httpClientService.post<Login_User, Login_User_Response>({ controller: "auth", action: "login" }, user);
        return response.token;
    }

    async GoogleLogin() {

    }
}
