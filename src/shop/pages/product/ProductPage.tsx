import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { useProductShop } from "@/shop/hooks/useProductShop"
import { useParams } from "react-router";


export const ProductPage = () => {

  const {idSlug} = useParams();

  const {data, isLoading} = useProductShop(idSlug || '')

  return (
    <>
      {
      (isLoading && <CustomFullScreenLoading/>)
      }
      
    
    </>
    
  )
}
