import axios from "axios";
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
            })
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
