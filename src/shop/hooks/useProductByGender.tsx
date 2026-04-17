import { useQuery } from "@tanstack/react-query"
import { getProductsByGenderAction } from "../actions/getProductsByGender.action"

export const useProductsByGender = (gender: string, currentSlug: string) => {
    const limit = 12
    const offset = 0

  const query = useQuery({
    queryKey: ['products', {limit, gender, offset}],
    queryFn: () => getProductsByGenderAction({gender, limit, offset}),
    enabled: !!gender,
    staleTime: 1000 * 60 * 5, // 5 minutos
    select: (products) =>
      products.products.filter((p) => p.slug !== currentSlug).slice(0, 8),
  })

  return {...query}
}
