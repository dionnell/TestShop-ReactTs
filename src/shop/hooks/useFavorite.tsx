import { useQuery } from "@tanstack/react-query"
import { getFavoritesByIdProduct } from "../actions/getFavoritesByIdProduct.action"

export const useFavorite = (productId: string) => {

    const query = useQuery({
    queryKey: ['favorites', {productId}],
    queryFn: () => getFavoritesByIdProduct(productId),
    enabled: !!productId,
    staleTime: 1000 * 60, 
    })
   

  return {...query}
 
}
