import { useMutation, useQuery } from "@tanstack/react-query"
import { getProductByIdAction } from "../action/getProductById.action"
import type { Product } from "@/interface/product.interface"
import { createUpdateProductAction } from "../action/create-update-product.action"


export const useProduct = (id: string) => {

  const query = useQuery({
      queryKey: ['product', {id}],
      queryFn: () => getProductByIdAction(id),
      retry: false,
      staleTime: 1000 * 60 * 5 //5 minutos
  })

  //Manejar la mutacion
  const mutation = useMutation({
    mutationFn: createUpdateProductAction,
  })



  //Submit del formulario
  //const handleSubmitForm = async(productLike: Partial<Product>) => {
  //  console.log({productLike})
  //}

  return {
    ...query,
    mutation,
  }
}
