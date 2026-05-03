import { testShopApi } from "@/api/testShopApi";
import type { AdminPayment } from "./getOrdersByUser.action";

interface Options {
    limit? : number | string,
    offset? : number | string,
    status? : string,
    query? : string,
}

export interface GetAdminOrdersResponse {
  count: number;
  payments: AdminPayment[];
  pages: number,
}


export const getAllOrdersAction = async (options: Options): Promise<GetAdminOrdersResponse> => {
  const {limit, offset, status, query} = options
  const { data } = await testShopApi.get<GetAdminOrdersResponse>("/payments/admin/all", {
    params: {
      limit,
      offset,
      status,
      q: query
    }
  });

  const productsWithImage = data.payments.map((payment) => ({
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

  return {
        ...data,
        payments: productsWithImage
    }
};