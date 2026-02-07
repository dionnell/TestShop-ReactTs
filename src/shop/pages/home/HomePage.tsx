import { CustomPagination } from "@/components/custom/CustomPagination"
import { Button } from "@/components/ui/button"
import { products } from "@/mocks/products.mock"
import { CustomJumbotron } from "@/shop/components/CustomJumbotron"
import { ProductsGrid } from "@/shop/components/ProductsGrid"

export const HomePage = () => {
  return (
    <>
      <CustomJumbotron 
      title="Todos los Productos" 
      subtitle="Explora nuestra colección completa de productos premium." 
      />

      <ProductsGrid products={products} />

      <CustomPagination totalPages={5} />
    </>
  )
}
