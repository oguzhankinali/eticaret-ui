import { HttpClientService } from "./httpclient.service"

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
}