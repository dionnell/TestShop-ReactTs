import { testShopApi } from "@/api/testShopApi";
import type { Product } from "@/interface/product.interface";

export const getRelatedProductsAction = async (
  productId: string,
  limit = 6
): Promise<Product[]> => {
  const { data } = await testShopApi.get<Product[]>(
    `/products/${productId}/related`,
    { params: { limit } }
  );

  // Normalizar URLs de imágenes igual que en el resto de la app
  return data.map((product) => ({
    ...product,
    images: product.images.map((image) =>
      image.includes("http")
        ? image
        : `${import.meta.env.VITE_API_URL}/files/product/${image}`
    ),
  }));
};