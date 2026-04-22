import { testShopApi } from "@/api/testShopApi";

export interface RemoveFromCartResponse {
  message: string;
  itemId: string;
}

export const removeFromCart = async (itemId: string): Promise<RemoveFromCartResponse> => {
  const { data } = await testShopApi.delete<RemoveFromCartResponse>(`/cart/item/${itemId}`);
  return data;
};