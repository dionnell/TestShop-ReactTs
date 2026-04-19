import { testShopApi } from "@/api/testShopApi";

export interface RemoveFavoriteResponse {
  message: string;
  productId: string;
}

export const removeFavorite = async (
  productId: string
): Promise<RemoveFavoriteResponse> => {
  const { data } = await testShopApi.delete<RemoveFavoriteResponse>(
    `/favorites/${productId}`
  );
  return data;
};
