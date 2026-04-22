import { testShopApi } from "@/api/testShopApi";
import type { Product } from "@/interface/product.interface";

export interface CartItem {
  id: string;
  size: string;
  quantity: number;
  createdAt: string;
  subtotal: number;
  product: Product;
}

export interface GetCartResponse {
  count: number;
  total: number;
  items: CartItem[];
}

export const getCart = async (): Promise<GetCartResponse> => {
  const { data } = await testShopApi.get<GetCartResponse>("/cart");

  return {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        images: item.product.images?.map((image) =>
          typeof image === "string"
            ? image.includes("http")
              ? image
              : `${import.meta.env.VITE_API_URL}/files/product/${image}`
            : `${import.meta.env.VITE_API_URL}/files/product/${(image as any).url}`
        ) ?? [],
      },
    })),
  };
};