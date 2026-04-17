import { testShopApi } from "@/api/testShopApi"
import type { ProductsResponse } from "@/interface/products.response"


interface Options {
    limit? : number | string,
    gender? : string | null,
    offset?: number
}

export const getProductsByGenderAction = async(options: Options): Promise<ProductsResponse> => {
    
    const {limit, gender, offset} = options

    const {data} = await testShopApi.get<ProductsResponse>('/products', {
        params: {
            limit,
            gender,
            offset
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