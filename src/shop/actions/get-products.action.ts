import { testShopApi } from "@/api/testShopApi"
import type { ProductsResponse } from "@/interface/products.response"

interface Options {
    limit?    : number | string,
    offset?   : number | string,
    sizes?    : string | null,
    gender?   : string | null,
    minPrice? : number | string,
    maxPrice? : number | string,
    query?    : string,
}

const normalizeImageUrl = (image: string) =>
  image.includes('http')
    ? image
    : `${import.meta.env.VITE_API_URL}/files/product/${image}`

export const getProductsAction = async (options: Options): Promise<ProductsResponse> => {
  const { limit, offset, sizes, gender, minPrice, maxPrice, query } = options

  const { data } = await testShopApi.get<ProductsResponse>('/products', {
    params: { limit, offset, sizes, gender, minPrice, maxPrice, q: query }
  })

  return {
    ...data,
    products: data.products.map(product => ({
      ...product,
      images: (product.images as unknown as string[]).map(normalizeImageUrl)
    }))
  }
}
