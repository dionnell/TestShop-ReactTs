import { testShopApi } from "@/api/testShopApi";
import type { Product } from "@/interface/product.interface";

export interface CartItem {
  id: string;
  createdAt: string;
  product: Product;
}

export interface GetCartResponse {
  count: number;
  cart: CartItem[];
}

export const getCart = async (): Promise<GetCartResponse> => {
  const { data } = await testShopApi.get<GetCartResponse>("/cart");

  return {
    ...data,
    cart: data.cart.map((item) => ({
      ...item,
      product: {
        ...item.product,
        images: item.product.images?.map((image) =>
          image.includes("http")
            ? image
            : `${import.meta.env.VITE_API_URL}/files/product/${image}`
        ) ?? [],
      },
    })),
  };
};
