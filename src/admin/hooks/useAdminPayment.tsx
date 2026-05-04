import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrdersByUserAction } from "../action/getOrdersByUser.action";
import { getAllOrdersAction } from "../action/getAllOrders.action";
import { patchCancelPaymentAction } from "../action/patchCancelPayment.action";
import { useSearchParams } from "react-router";

export const useAdminPayment = (userId: string | null) => {
  return useQuery({
    queryKey: ["admin-payments", userId],
    queryFn: () => getOrdersByUserAction(userId!),
    enabled: !!userId,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAllOrders = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const q = searchParams.get("query") || "";
  const limit = searchParams.get("limit") || 9;
  const page = searchParams.get("page") || 1;
  const offset = (Number(page) - 1) * Number(limit);
  const status = searchParams.get("status") || "all";

  const query = useQuery({
    queryKey: ["admin-all-payments", { limit, offset, query: q, status }],
    queryFn: () =>
      getAllOrdersAction({
        query: q || undefined,
        limit: isNaN(+limit) ? 0 : limit,
        offset: isNaN(offset) ? 0 : offset,
        status: status !== "all" ? status : undefined,
      }),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => patchCancelPaymentAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-payments"] });
    },
  });

  return {
    ...query,
    cancelPayment: cancelMutation.mutate,
    isCancellingPayment: cancelMutation.isPending,
    cancellingId: cancelMutation.variables,
  };
};