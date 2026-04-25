import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCart, type GetCartResponse } from "../actions/getCart.action"
import { removeFromCart } from "../actions/removefromcart.action"
import { updateCartItem } from "../actions/updatecartitem.action"

export const useCart = () => {
  const queryClient = useQueryClient()

  const cartQuery = useQuery<GetCartResponse>({
    queryKey: ["cart"],
    queryFn: getCart,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
 
  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeFromCart(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  })

  return {
    ...cartQuery,
    removeFromCart: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
    removingId: removeMutation.variables as string | undefined,
    updateCartItem: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  }
}