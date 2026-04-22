import { testShopApi } from "@/api/testShopApi";

export interface addToCartResponse {
  message: string;
  productId: string;
  size: string;
}

export const addToCart = async (productId: string, size: string): Promise<addToCartResponse> => {
  try {
    const { data } = await testShopApi.post<addToCartResponse>('/cart', {
      productId,
      size
    })
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
   
}