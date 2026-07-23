import { testShopApi } from "@/api/testShopApi"
import type { ProductsResponse } from "@/interface/products.response"

interface Options {
    limit?  : number | string,
    gender? : string | null,
    offset? : number
}

const normalizeImageUrl = (image: string) =>
  image.includes('http')
    ? image
    : `${import.meta.env.VITE_API_URL}/files/product/${image}`

export const getProductsByGenderAction = async (options: Options): Promise<ProductsResponse> => {
  const { limit, gender, offset } = options

  const { data } = await testShopApi.get<ProductsResponse>('/products', {
    params: { limit, gender, offset }
  })

  return {
    ...data,
    products: data.products.map(product => ({
      ...product,
      images: (product.images as unknown as string[]).map(normalizeImageUrl)
    }))
  }
}
