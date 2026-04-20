import { useQuery } from "@tanstack/react-query"
import { getFavorites } from "../actions/getFavorites.action"

export const useFavorite = (productId: string) => {
  const query = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
    enabled: !!productId,
    staleTime: 1000 * 60,
    retry: false,
    select: (data) => data.favorites.some(f => f.product.id === productId)
  })

  return { ...query }
}