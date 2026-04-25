import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getFavorites, type GetFavoritesResponse } from "../actions/getFavorites.action"
import { addFavorite } from "../actions/addFavorite.action"
import { removeFavorite } from "../actions/removeFavorite.action"
import { getFavoritesAdminAction, type GetFavoritesAdminResponse } from "@/admin/action/getFavoritesAdmin.action"
import { useSearchParams } from "react-router"

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

// Hook para saber cuantos productos estan en favoritos
export const useFavoritesCount = () => {
  const [ searchParams ] = useSearchParams()

  const query = searchParams.get('query') || ''
  const limit = searchParams.get('limit') || 9
  const page = searchParams.get('page') || 1
  const offset = (Number(page) -1 ) * Number(limit)

  const adminFavoritesQuery = useQuery<GetFavoritesAdminResponse>({
    queryKey: ["favorites", { limit, offset, query }],
    queryFn: () => getFavoritesAdminAction({
      limit,
      offset,
      query
    }),
    retry: false,
    staleTime: 1000 * 60,
  })

  return {
    ...adminFavoritesQuery
  }

}