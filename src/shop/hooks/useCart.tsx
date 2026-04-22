import { useQuery } from "@tanstack/react-query"
import { getCart, type GetCartResponse } from "../actions/getCart.action"

export const useCart = () => {

  const queryCart = useQuery<GetCartResponse>({
      queryKey: ['cart'],
      queryFn: () => getCart(),
      retry: false,
      staleTime: 1000 * 60 * 5 //5 minutos
  })

  return {
    ...queryCart
  }
}
