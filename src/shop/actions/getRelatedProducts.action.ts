import { testShopApi } from "@/api/testShopApi";
import type { ShopProduct } from "@/interface/product.interface";

export const getRelatedProductsAction = async (
  productId: string,
  limit = 6
): Promise<ShopProduct[]> => {
  const { data } = await testShopApi.get<any[]>(
    `/products/${productId}/related`,
    { params: { limit } }
  );

  return data.map((product) => ({
    ...product,
    images: (product.images as any[]).map((img: any) => {
      const url = typeof img === 'string' ? img : img.url;
      return url.includes('http')
        ? url
        : `${import.meta.env.VITE_API_URL}/files/product/${url}`;
    }),
  }));
};
