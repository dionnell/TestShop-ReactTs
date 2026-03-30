import { AdminTitle } from "@/admin/components/AdminTitle"
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/currency-formatter"
import { useProducts } from "@/shop/hooks/useProducts"
import { PencilIcon, PlusCircleIcon } from "lucide-react"
import { Link } from "react-router"



export const AdminProductsPage = () => {

    const { data, isLoading } = useProducts()

    if(isLoading) {
      return <CustomFullScreenLoading/>
    }
  
  return (
    <>
      <div className="flex justify-between items-center">
        <AdminTitle 
          title="Productos"
          subtitle="Aqui puedes ver y administrar tus Productos"
        />

        <div className="flex justify-end mb-10 gap-4">
          <Link to='/admin/products/new'>
            <Button variant='default'>
              <PlusCircleIcon/>
              Nuevo Producto
            </Button>
          </Link>
        </div>
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
            <TableHead >Tallas</TableHead>
            <TableHead >Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {
            data?.products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell className="max-w-[140px] truncate">
                  <Link
                    to={`/admin/products/${product.id}`}
                    className="font-semibold hover:text-blue-500 hover:underline"
                  >
                    {product.title}
                  </Link> 
                </TableCell>
                <TableCell className="max-w-[100px] px-4">{formatCurrency(product.price, 'CLP')}</TableCell>
                <TableCell className="max-w-[80px] px-4">{product.tags?.join(', ')}</TableCell>
                <TableCell className="max-w-[100px] px-4">{product.stock}</TableCell>
                <TableCell className="max-w-[100px] truncate px-4">{product.sizes?.join(', ')}</TableCell>
                <TableCell className="text-center">
                  <Link
                    to={`/admin/products/${product.id}`}
                  >
                    <PencilIcon className="w-4 h-4 text-blue-500"/>
                  </Link>
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
