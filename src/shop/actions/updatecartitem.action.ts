import { testShopApi } from "@/api/testShopApi";

export interface UpdateCartItemResponse {
  message: string;
  itemId: string;
  quantity: number;
}

export const updateCartItem = async (
  itemId: string,
  quantity: number
): Promise<UpdateCartItemResponse> => {
  const { data } = await testShopApi.patch<UpdateCartItemResponse>(`/cart/item/${itemId}`, {
    quantity,
  });
  return data;
};