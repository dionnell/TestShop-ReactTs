import { testShopApi } from "@/api/testShopApi";

export interface PaymentItemSnapshot {
  id: string;
  unitPrice: number;
  size: string;
  quantity: number;
  subtotal: number;
  product: {
    id: string;
    title: string;
    images: string[];
    price: number;
    slug: string;
  } | null;
}

export interface PaymentHistory {
  id: string;
  buyOrder: string;
  amount: number;
  items: PaymentItemSnapshot[];
  createdAt: string;
  updatedAt: string;
}

export const getMyPaymentsAction = async (): Promise<PaymentHistory[]> => {
  const { data } = await testShopApi.get<PaymentHistory[]>('/payments/my-payments');

  return data.map((payment) => ({
    ...payment,
    items: payment.items.map((item) => ({
      ...item,
      product: item.product
        ? {
            ...item.product,
            images: item.product.images?.map((image: any) => {
              const url = typeof image === 'string' ? image : image.url;
              return url.includes('http')
                ? url
                : `${import.meta.env.VITE_API_URL}/files/product/${url}`;
            }) ?? [],
          }
        : null,
    })),
  }));
};