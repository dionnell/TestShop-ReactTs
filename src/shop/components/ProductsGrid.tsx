import { Button } from "@/components/ui/button"
import { Filter, Grid, List } from "lucide-react"
import { ProductCard } from "./ProductCard"
import { FilterSidebar } from "./FilterSidebar"
import { useSearchParams } from "react-router"
import { useState } from "react"
import type { Product } from "@/interface/product.interface"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading"


interface Props {
    products: Product[],
}

const limitOptions = [
  9,
  12,
  15,
  21,
]

export const ProductsGrid = ({products} : Props) => {

  const [searchParams, setSearchParams,] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  
  const viewMode = searchParams.get('viewMode') || 'grid'

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    searchParams.set('viewMode', mode)
    setSearchParams(searchParams)
  }

  const handleLimitChange = (value: number | null) => {
    if(value != null) {
    searchParams.set('page', '1') // Resetear a la página 1 al cambiar el filtro
    searchParams.set('limit', String(value))
    setSearchParams(searchParams)
    }
  }

  return (
    <section className="py-10 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-light">Productos</h2>
            <span className="text-muted-foreground">({products.length} productos)</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <div className="hidden md:flex justify-start items-center space-x-2 ">
              <span className='text-xl font-light'>Vistas: </span>
              <Combobox 
                items={limitOptions}
                defaultValue={limitOptions[0]}
                onValueChange={handleLimitChange}
              >
                <ComboboxInput placeholder="Select a framework" />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

            </div>
            <div className="hidden md:flex border rounded-md">
              <Button
                variant={viewMode === 'grid' 
                  ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>
          {/* Mobile Filters */} 
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-background p-4 lg:hidden">
              <div className="flex items-center justify-end mb-1 ">
                <Button 
                  variant="ghost" 
                  className="border-2 rounded-2xl p-3 translate-y-2"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  Cerrar
                </Button>
              </div>
              <FilterSidebar />
            </div>
          )}
          {/* Products Grid */}
          {
              products.length === 0 && ( <CustomFullScreenLoading/>)
          }
          <div className="flex-1">
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-2 lg:grid-cols-4 gap-6" 
                : "space-y-4"
            }>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.title}
                  price={product.price}
                  image={product.images}
                  category={product.tags[0]}
                  size={product.sizes}
                  slug={product.slug}
                />
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}
