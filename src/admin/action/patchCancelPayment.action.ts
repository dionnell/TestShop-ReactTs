import { testShopApi } from "@/api/testShopApi";

export interface CancelPaymentResponse {
  message: string;
  id: string;
  buyOrder: string;
  status: string;
}

export const patchCancelPaymentAction = async (id: string): Promise<CancelPaymentResponse> => {
  const { data } = await testShopApi.patch<CancelPaymentResponse>(`/payments/${id}/cancel`);
  return data;
};