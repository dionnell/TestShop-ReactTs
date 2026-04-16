import { useQuery } from "@tanstack/react-query"
import { getProductBySlugAction } from "../actions/getProductBySlug.action"

export const useProductShop = (slug: string) => {

  const query = useQuery({
        queryKey: ['products', {slug}],
        queryFn: () => getProductBySlugAction(slug),
        retry: false,
        staleTime: 1000 * 60 * 5 //5 minutos
  })

  return {
    ...query
  }
}
