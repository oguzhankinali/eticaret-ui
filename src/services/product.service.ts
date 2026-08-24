import { HttpClientService } from "./httpclient.service";
import type { List_Product_Response } from "../contracts/products/list_product_response";
import type { Create_Product } from "@/contracts/products/create_product";
import type { Update_Product } from "@/contracts/products/update_product";
import type { List_Product_Image } from "@/contracts/products/list_product_image";


export default class ProductService {

    httpClientService: HttpClientService
    constructor(httpClientService: HttpClientService) {
        this.httpClientService = httpClientService;
    }

    async read(page: number = 0, size: number = 5): Promise<List_Product_Response> {
        return await this.httpClientService.get<List_Product_Response>({ controller: "products", queryString: `page=${page}&size=${size}` });
    }
    async create(product: Create_Product): Promise<void> {
        await this.httpClientService.post<Create_Product, any>({ controller: "products" }, product);
    }

    async delete(id: string): Promise<void> {
        await this.httpClientService.delete<void>({ controller: "products" }, id);
    }

    async update(product: Update_Product): Promise<void> {
        await this.httpClientService.put<Update_Product, void>({ controller: "products" }, product)
    }

    async readImages(id: string): Promise<List_Product_Image[]> {
        return await this.httpClientService.get<List_Product_Image[]>({ controller: "products", action: `GetProductImages/${id}` });
    }

    async deleteImage(id: string, imageId: string): Promise<void> {
        await this.httpClientService.delete<void>({ controller: "products", action: `DeleteProductImage`, queryString: `imageId=${imageId}` }, id);
    }
}