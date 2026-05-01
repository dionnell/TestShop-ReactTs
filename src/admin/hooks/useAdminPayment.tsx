import { useQuery } from "@tanstack/react-query";
import { getOrdersByUserAction } from "../action/getOrdersByUser.action";

export const useAdminPayment = (userId: string | null) => {
  return useQuery({
    queryKey: ["admin-payments", userId],
    queryFn: () => getOrdersByUserAction(userId!),
    enabled: !!userId,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};