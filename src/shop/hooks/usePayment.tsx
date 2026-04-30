import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createPaymentAction } from "../actions/createPayment.action"
import { getMyPaymentsAction } from "../actions/getPaymentUser.action"
import { toast } from "sonner"

export const usePayment = () => {
  const queryClient = useQueryClient()

  const paymentMutation = useMutation({
    mutationFn: () => createPaymentAction(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      queryClient.invalidateQueries({ queryKey: ["my-payments"] })
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "No se pudo iniciar el pago. Intenta de nuevo.",
        { position: "top-right", richColors: true }
      )
    },
  })

  const initiatePayment = async () => {
    try {
      const { url, token } = await paymentMutation.mutateAsync()

      const form = document.createElement("form")
      form.method = "POST"
      form.action = url

      const input = document.createElement("input")
      input.type = "hidden"
      input.name = "token_ws"
      input.value = token

      form.appendChild(input)
      document.body.appendChild(form)
      form.submit()
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "No se pudo iniciar el pago. Intenta de nuevo.",
        { position: "top-right", richColors: true }
      )
    }
  }

  return {
    initiatePayment,
    isLoading: paymentMutation.isPending,
  }
}

// Hook separado para el historial de pagos
export const useMyPayments = () => {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: getMyPaymentsAction,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}