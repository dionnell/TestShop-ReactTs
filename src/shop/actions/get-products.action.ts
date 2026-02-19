import { testShopApi } from "@/api/testShopApi"
import type { ProductsResponse } from "@/interface/products.response"


interface Options {
    limit? : number | string,
    offset? : number | string,
    sizes? : string | null,
    gender? : string | null
}

export const getProductsAction = async(options: Options): Promise<ProductsResponse> => {
    
    const {limit, offset, sizes, gender} = options

    const {data} = await testShopApi.get<ProductsResponse>('/products', {
        params: {
            limit,
            offset,
            sizes, 
            gender
        }
    }) 

    const productsWithImage = data.products.map(product => ({
        ...product,
        images: product.images.map(
            image => `${import.meta.env.VITE_API_URL}/files/product/${image}`
        )
    }))

    return {
        ...data,
        products: productsWithImage
    }
}