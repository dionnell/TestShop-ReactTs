import { testShopApi } from "@/api/testShopApi"
import type { Product } from "@/interface/product.interface"


export const getProductBySlugAction = async(slug: string): Promise<Product> => {
    
    const {data} = await testShopApi.get<Product>(`/products/${slug}`) 

    const images = data.images.map(image => {
        if(image.includes('http')) return image

        return `${import.meta.env.VITE_API_URL}/files/product/${image}`
    })

    return {
        ...data,
        images
    }
}