import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomJumbotron } from "@/shop/components/CustomJumbotron"
import { ProductsGrid } from "@/shop/components/ProductsGrid"
import { useParams,  } from "react-router"
import { useProducts } from "@/shop/hooks/useProducts"


export const GenderPage = () => {

  const { data } = useProducts()
  const {gender} = useParams()
  const genderTitle = gender === 'men'
    ? 'Hombres'
    : gender === 'women'
      ? 'Mujeres'
      : 'Niños'

  return (
    <>
          <CustomJumbotron 
          title={`Productos para ${genderTitle}`}
          subtitle="Explora nuestra colección completa de productos premium." 
          />
    
          <ProductsGrid products={data?.products || []} />
    
          <CustomPagination totalPages={data?.pages || 0} />
        </>
  )
}
