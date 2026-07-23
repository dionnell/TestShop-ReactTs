import type { ShopProduct } from "./product.interface";

export interface ProductsResponse {
    count:    number;
    pages:    number;
    products: ShopProduct[];
}
