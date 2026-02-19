import { useQuery } from "@tanstack/react-query"
import { getProductsAction } from "../actions/get-products.action"
import { useParams, useSearchParams } from "react-router"

export const useProducts = () => {
    //TODO: logica para paginacion, filtros, etc
    const {gender} = useParams()

    const [ searchParams ] = useSearchParams()

    const limit = searchParams.get('limit') || 9
    const page = searchParams.get('page') || 1
    const sizes = searchParams.get('sizes')

    const offset = (Number(page) -1 ) * Number(limit)

  return useQuery({
    queryKey: ['products', {limit, offset, sizes, gender}],
    queryFn: () => getProductsAction({
      limit: isNaN(+limit) ? 0 : limit,
      offset: isNaN(offset) ? 0 : offset,
      sizes: sizes || null,
      gender
    }),
    staleTime: 1000 * 60 * 5, //5 minutos
  })
}
