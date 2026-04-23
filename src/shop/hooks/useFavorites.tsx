import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getFavorites, type GetFavoritesResponse } from "../actions/getFavorites.action"
import { addFavorite } from "../actions/addFavorite.action"
import { removeFavorite } from "../actions/removeFavorite.action"

export const useFavorites = () => {
  const queryClient = useQueryClient()

  const favoritesQuery = useQuery<GetFavoritesResponse>({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    retry: false,
    staleTime: 1000 * 60,
  })

  const addMutation = useMutation({
    mutationFn: (productId: string) => addFavorite(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  })

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFavorite(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  })

  return {
    ...favoritesQuery,
    addFavorite: addMutation.mutate,
    isAdding: addMutation.isPending,
    addingId: addMutation.variables as string | undefined,
    removeFavorite: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
    removingId: removeMutation.variables as string | undefined,
  }
}

// Hook para saber si un producto específico es favorito
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