import { testShopApi } from "@/api/testShopApi";

export interface CreatePaymentResponse {
  url: string;
  token: string;
  amount: number;
  itemCount: number;
}

export const createPaymentAction = async (): Promise<CreatePaymentResponse> => {
  const { data } = await testShopApi.post<CreatePaymentResponse>("/payments/create");
  return data;
};