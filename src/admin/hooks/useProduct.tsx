import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductByIdAction } from "../action/getProductById.action"
import { createUpdateProductAction } from "../action/create-update-product.action"
import type { Product } from "@/interface/product.interface"


export const useProduct = (id: string) => {

  const queryClient = useQueryClient()

  const query = useQuery({
      queryKey: ['product', {id}],
      queryFn: () => getProductByIdAction(id),
      retry: false,
      staleTime: 1000 * 60 * 5 //5 minutos
  })

  //Manejar la mutacion
  const mutation = useMutation({
    mutationFn: createUpdateProductAction,
    onSuccess: (product: Product) => {
      //Invalidar el cache
      queryClient.invalidateQueries({queryKey: ['products']})
      queryClient.invalidateQueries({queryKey: ['product', {id: product.id}]})

      //Actualizar el queryData
      queryClient.setQueryData(['products', {id: product.id}], product)

    }
  })


  return {
    ...query,
    mutation,
  }
}
