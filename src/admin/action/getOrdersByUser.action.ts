import { testShopApi } from "@/api/testShopApi";

export interface AdminPaymentItem {
  id: string;
  size: string;
  quantity: number;
  subtotal: number;
  unitPrice: number;
  product: {
    id: string;
    title: string;
    slug: string;
    images: string[];
  } | null;
}

export interface AdminPayment {
  id: string;
  buyOrder: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: AdminPaymentItem[];
}

export const getOrdersByUserAction = async (userId: string): Promise<AdminPayment[]> => {
  try {
    const { data } = await testShopApi.get<AdminPayment[]>(
      `/payments/user/${userId}/payments`
    );

    return data.map((payment) => ({
      ...payment,
      items: payment.items.map((item) => ({
        ...item,
        product: item.product
          ? {
              ...item.product,
              images: item.product.images?.map((image: any) => {
                const url = typeof image === "string" ? image : image.url;
                return url.includes("http")
                  ? url
                  : `${import.meta.env.VITE_API_URL}/files/product/${url}`;
              }) ?? [],
            }
          : null,
      })),
    }));
  } catch {
    // Si no tiene pagos el backend lanza 404, retornamos array vacío
    return [];
  }
};