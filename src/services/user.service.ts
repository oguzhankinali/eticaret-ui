import type { Login_User } from "@/contracts/users/login_user";
import { HttpClientService } from "./httpclient.service"
import type { Token } from "@/contracts/token/token";
import type { Login_User_Response } from "@/contracts/users/login_user_response";

export interface Create_User {
    nameSurname: string,
    userName: string,
    email: string,
    password: string,
    passwordConfirm: string
}
export interface Create_User_Response {
    succeeded: boolean,
    message: string
}
export class UserService {
    private httpClientService: HttpClientService;
    constructor(httpClientService: HttpClientService) {
        this.httpClientService = httpClientService;
    }


    async create(user: Create_User): Promise<Create_User_Response> {
        return await this.httpClientService.post<Create_User, Create_User_Response>({ controller: "users" }, user);
    }

    async login(user: Login_User): Promise<Token> {
        let response: Login_User_Response = await this.httpClientService.post<Login_User, Login_User_Response>({ controller: "users", action: "login" }, user);
        return response.token;
    }
}