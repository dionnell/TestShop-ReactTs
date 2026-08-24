import { testShopApi } from "@/api/testShopApi";
import type { Product, ProductImage } from "@/interface/product.interface";

export const getProductByIdAction = async (id: string): Promise<Product> => {
  if (!id) throw new Error('Product id is required');

  if (id === 'new') {
    return {
      id: 'new',
      title: '',
      description: '',
      price: 0,
      slug: '',
      stock: 0,
      sizes: [],
      gender: 'unisex',
      tags: [],
      images: [],
    } as unknown as Product;
  }

  const { data } = await testShopApi.get<Product>(`/products/${id}`);

  // Backend now returns image objects with { id, url, publicId, order }
  const images: ProductImage[] = (data.images as unknown as (ProductImage | string)[])
    .map((img, index) => {
      if (typeof img === 'string') {
        const url = img.includes('http')
          ? img
          : `${import.meta.env.VITE_API_URL}/files/product/${img}`;
        return { id: index, url, publicId: undefined, order: index };
      }
      return img;
    })
    .sort((a, b) => a.order - b.order); // garantizar orden correcto

  return { ...data, images };
};
