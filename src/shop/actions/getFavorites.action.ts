import { testShopApi } from "@/api/testShopApi";
import type { Product } from "@/interface/product.interface";

export interface FavoriteItem {
  id: string;
  createdAt: string;
  product: Product;
}

export interface GetFavoritesResponse {
  count: number;
  favorites: FavoriteItem[];
}

export const getFavorites = async (): Promise<GetFavoritesResponse> => {
  const { data } = await testShopApi.get<GetFavoritesResponse>("/favorites");

  return {
    ...data,
    favorites: data.favorites.map((favorite) => ({
      ...favorite,
      product: {
        ...favorite.product,
        images: favorite.product.images?.map((image) =>
          image.includes("http")
            ? image
            : `${import.meta.env.VITE_API_URL}/files/product/${image}`
        ) ?? [],
      },
    })),
  };
};
