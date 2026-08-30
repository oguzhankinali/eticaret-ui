import type { RefreshTokenRequest } from "@/contracts/token/refreshToken";
import type { Token } from "@/contracts/token/token";
import axios from "axios";
import toast from "react-hot-toast";

interface QueueItem {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}

let isRefreshing: boolean = false;
let failedQueue: QueueItem[] = [];
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((item) => {
        if (error)
            item.reject(error);
        else
            item.resolve(token!);
    });
    failedQueue = [];
};
export interface RequestParameters {
    controller: string;
    action?: string;
    queryString?: string;
    headers?: any;
    baseUrl?: string;
    fullPath?: string;
}

export class HttpClientService {

    constructor() {
        axios.interceptors.request.use((config) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
            (error) => {
                return Promise.reject(error);
            });

        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status: number | undefined = error.response?.status;

                switch (status) {
                    case 400:
                        toast.error(error.response?.data?.message || "Geçersiz istek yapıldı."); break;
                    case 401:
                        if (isRefreshing) {
                            return new Promise<string>((resolve, reject) => {
                                failedQueue.push({ resolve, reject });
                            }).then((token: string) => {
                                if (error.config.headers)
                                    error.config.headers["Authorization"] = `Bearer ${token}`;
                                return axios(error.config);
                            });
                        }
                        const originalRequest = error.config;
                        const refreshToken = localStorage.getItem("refreshToken");

                        if (refreshToken && !originalRequest._retry) {
                            originalRequest._retry = true;

                            try {
                                isRefreshing = true;
                                const response = await this.post<RefreshTokenRequest, Token>(
                                    { controller: "auth", action: "refresh-token-login" },
                                    { refreshToken: refreshToken }
                                );
                                processQueue(null, response.accessToken);
                                localStorage.setItem("refreshToken", response.refreshToken);
                                localStorage.setItem("accessToken", response.accessToken);
                                originalRequest.headers["Authorization"] = `Bearer ${response.accessToken}`;
                                isRefreshing = false;
                                return axios(originalRequest);
                            } catch (refreshError) {
                                processQueue(refreshError, null);
                                localStorage.removeItem("accessToken");
                                localStorage.removeItem("refreshToken");
                                window.location.href = "/login";
                                return Promise.reject(refreshError);
                            }
                        }
                        return Promise.reject(error);

                    case 403:
                        toast.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
                        break;
                    case 500:
                        toast.error(error.response?.data?.message || "Sunucu tarafında beklenmeyen bir hata oluştu.");
                        break;
                    default:
                        toast.error(error.message || "Beklenmeyen bir hata meydana geldi.");
                        break;
                        break;
                }

                return Promise.reject(error);
            }
        );



    }

    private baseUrl: string = "https://localhost:7083/api";
    private url(requestParameter: Partial<RequestParameters>): string {
        if (requestParameter.fullPath)
            return requestParameter.fullPath;

        const base: string = requestParameter.baseUrl ? requestParameter.baseUrl : this.baseUrl;

        let fullUrl: string = `${base}/${requestParameter.controller}`;

        if (requestParameter.action)
            fullUrl += `/${requestParameter.action}`;

        return fullUrl;
    }
    async get<T>(requestParameter: Partial<RequestParameters>): Promise<T> {
        let reqUrl: string = "";
        if (requestParameter.fullPath)
            reqUrl = requestParameter.fullPath;
        else
            reqUrl = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;

        const response = await axios.get<T>(reqUrl, { headers: requestParameter.headers });
        return response.data;
    }
    async post<T, R>(requestParameter: Partial<RequestParameters>, body: Partial<T>): Promise<R> {
        let reqUrl: string = "";
        if (requestParameter.fullPath)
            reqUrl = requestParameter.fullPath;
        else
            reqUrl = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;
        const response = await axios.post<R>(reqUrl, body, { headers: requestParameter.headers });
        return response.data
    }
    async put<T, R>(requestParameter: Partial<RequestParameters>, body: Partial<T>): Promise<R> {
        let reqUrl: string = "";
        if (requestParameter.fullPath)
            reqUrl = requestParameter.fullPath;
        else
            reqUrl = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;

        const response = await axios.put<R>(reqUrl, body, { headers: requestParameter.headers });
        return response.data;
    }
    async delete<R>(requestParameter: Partial<RequestParameters>, id: string): Promise<R> {
        let reqUrl: string = "";
        if (requestParameter.fullPath)
            reqUrl = requestParameter.fullPath;
        else
            reqUrl = `${this.url(requestParameter)}/${id}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;
        const response = await axios.delete<R>(reqUrl, { headers: requestParameter.headers });
        return response.data;
    }
}
