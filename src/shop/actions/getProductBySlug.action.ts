import { testShopApi } from "@/api/testShopApi"
import type { ShopProduct } from "@/interface/product.interface"

export const getProductBySlugAction = async (slug: string): Promise<ShopProduct> => {
  const { data } = await testShopApi.get<any>(`/products/${slug}`)

  // detail endpoint returns image objects {id, url, publicId, order}
  const images: string[] = (data.images as any[]).map((img: any) => {
    const url = typeof img === 'string' ? img : img.url
    return url.includes('http')
      ? url
      : `${import.meta.env.VITE_API_URL}/files/product/${url}`
  })

  return { ...data, images }
}
