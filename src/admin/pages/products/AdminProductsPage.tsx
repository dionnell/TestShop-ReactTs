import { AdminTitle } from "@/admin/components/AdminTitle"
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
import { PlusCircleIcon } from "lucide-react"
import { Link } from "react-router"

export const AdminProductsPage = () => {
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
        className="bg-white p-10 shadow-xs border border-gray-200 mb-10"
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>categoria</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Tallas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>
              <img
                src="/placeholder.svg"
                alt="Product"
                className="w-20 h-20 object-cover rounded-md"
              />
            </TableCell>
            <TableCell>Producto 1</TableCell>
            <TableCell>$2500000</TableCell>
            <TableCell>Categoria 1</TableCell>
            <TableCell>Stock 20</TableCell>
            <TableCell>XL, M, L</TableCell>
            <TableCell className="text-right">
              <Link
                to={`/admin/products/poleraM`}
              >
                Editar
              </Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <CustomPagination
        totalPages={10}
      />

    </>
  )
}
