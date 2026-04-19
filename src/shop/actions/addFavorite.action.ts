import { testShopApi } from "@/api/testShopApi";

export interface AddFavoriteResponse {
  message: string;
  productId: string;
}

export const addFavorite = async (productId: string): Promise<AddFavoriteResponse> => {
  try {
    const { data } = await testShopApi.post<AddFavoriteResponse>('/favorites', {
      productId
    })
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
   
}