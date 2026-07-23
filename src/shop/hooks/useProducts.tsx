import { useQuery } from "@tanstack/react-query"
import { getProductsAction } from "../actions/get-products.action"
import { useParams, useSearchParams } from "react-router"

export const useProducts = () => {
    //logica para paginacion, filtros, etc
    const {gender} = useParams()

    const [ searchParams ] = useSearchParams()

    const query = searchParams.get('query') || ''
    const limit = Number(searchParams.get('limit') || 9)
    const page  = Number(searchParams.get('page')  || 1)
    const sizes = searchParams.get('sizes')
 
    const offset = (page - 1) * limit
    
    const price = searchParams.get('price') || 'any'

    let minPrice = undefined
    let maxPrice = undefined

    switch(price) {
      case 'any':
        //minPrice = undefined
        //maxPrice = undefined
        break
      case '0-50':
        minPrice = 0
        maxPrice = 50
        break
      case '50-100':
        minPrice = 50
        maxPrice = 100
        break
      case '100-200':
        minPrice = 100
        maxPrice = 200
        break
      case '200+':
        minPrice = 200
        maxPrice = undefined
        break
    }

  return useQuery({
    queryKey: ['products', {limit, offset, sizes, gender, minPrice, maxPrice, query}],
    queryFn: () => getProductsAction({
      limit: isNaN(+limit) ? 0 : limit,
      offset: isNaN(offset) ? 0 : offset,
      sizes: sizes || null,
      gender,
      minPrice,
      maxPrice,
      query: query || undefined
    }),
    staleTime: 1000 * 60 * 5, //5 minutos
  })
}
