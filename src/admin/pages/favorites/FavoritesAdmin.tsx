import { AdminTitle } from "@/admin/components/AdminTitle"
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/currency-formatter"
import { useFavoritesCount } from "@/shop/hooks/useFavorites"
import { Link } from "react-router"

export const FavoritesAdmin = () => {
  const { data, isLoading } = useFavoritesCount()

    if(isLoading) {
      return <CustomFullScreenLoading/>
    }
  
  return (
    <>
      <div className="flex justify-between items-center">
        <AdminTitle 
          title="Favoritos"
          subtitle="Aqui puedes ver la cantidad de veces que un producto ha sido marcado como favorito por los usuarios"
        />

        
      </div>
      
      <Table
        className="bg-white p-10 shadow-xs border-2 border-gray-200 mb-10"
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-[110px]">Imagen</TableHead>
            <TableHead >Nombre</TableHead>
            <TableHead >Precio</TableHead>
            <TableHead >Categoria</TableHead>
            <TableHead >Stock</TableHead>
            <TableHead >Cantidad de Usuarios</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {
            data!.favorites.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.product.images[0]}
                    alt={product.product.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell className="max-w-[140px] truncate">
                  <Link
                    to={`/admin/products/${product.id}`}
                    className="font-semibold hover:text-blue-500 hover:underline"
                  >
                    {product.product.title}
                  </Link> 
                </TableCell>
                <TableCell className="max-w-[100px] px-4">{formatCurrency(product.product.price, 'CLP')}</TableCell>
                <TableCell className="max-w-[80px] px-4">{product.product.tags?.join(', ')}</TableCell>
                <TableCell className="max-w-[100px] px-4">{product.product.stock}</TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-red-50 text-red-600 font-semibold text-sm">
                    {product.favoriteCount}
                  </span>
                </TableCell>
              </TableRow>
            ))
          }
            
          
        </TableBody>
      </Table>

      <CustomPagination
        totalPages={data?.pages || 0}
      />

    </>
  )
}
