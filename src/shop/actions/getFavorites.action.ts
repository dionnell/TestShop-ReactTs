import { testShopApi } from "@/api/testShopApi";
import type { Product, ProductImage } from "@/interface/product.interface";

export interface FavoriteItem {
  id: string;
  createdAt: string;
  product: Product;
}

export interface GetFavoritesResponse {
  count: number;
  favorites: FavoriteItem[];
}

const normalizeImage = (img: any): ProductImage => {
  if (typeof img === "string") {
    const url = img.includes("http")
      ? img
      : `${import.meta.env.VITE_API_URL}/files/product/${img}`;
    return { id: 0, url, publicId: undefined, order: 0 };
  }
  return img as ProductImage;
};

export const getFavorites = async (): Promise<GetFavoritesResponse> => {
  const { data } = await testShopApi.get<GetFavoritesResponse>("/favorites");

  return {
    ...data,
    favorites: data.favorites.map((favorite) => ({
      ...favorite,
      product: {
        ...favorite.product,
        images: (favorite.product.images as unknown as any[])?.map(normalizeImage) ?? [],
      },
    })),
  };
};