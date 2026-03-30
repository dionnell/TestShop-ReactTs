import { testShopApi } from "@/api/testShopApi";
import type { Product } from "@/interface/product.interface";


export const getProductByIdAction = async(id: string): Promise<Product> => {

    if(!id) throw new Error('Product id is required')

    if(id === 'new'){
        return {
            id: 'new',
            title: '',
            description: '',
            price: 0,
            slug: '',
            stock: 0,
            sizes: [],
            gender: 'unisex',
            tags: [],
            images: []
        } as unknown as Product
    }

    const { data } = await testShopApi.get<Product>(`/products/${id}`)

    const images = data.images.map(image => {
        if(image.includes('http')) return image

        return `${import.meta.env.VITE_API_URL}/files/product/${image}`
    })

    return {
        ...data,
        images
    }
}