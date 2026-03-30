import { useQuery } from "@tanstack/react-query"
import { getProductByIdAction } from "../action/getProductById.action"


export const useProduct = (id: string) => {

    const query = useQuery({
        queryKey: ['product', {id}],
        queryFn: () => getProductByIdAction(id),
        retry: false,
        staleTime: 1000 * 60 * 5 //5 minutos
    })

    //Manejar la mutacion


  return {
    ...query
  }
}
