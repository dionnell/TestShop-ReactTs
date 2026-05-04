import { AdminTitle } from "@/admin/components/AdminTitle"
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/currency-formatter"
import { useProducts } from "@/shop/hooks/useProducts"
import { ChevronDown, PencilIcon, PlusCircleIcon } from "lucide-react"
import { Link } from "react-router"
import { useState } from "react"
import { cn } from "@/lib/utils"
import React from "react"

export const AdminProductsPage = () => {
  const { data, isLoading } = useProducts()
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleRow = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id)
  }

  if (isLoading) return <CustomFullScreenLoading />

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
              <PlusCircleIcon />
              <span className="hidden sm:inline">Nuevo Producto</span>
            </Button>
          </Link>
        </div>
      </div>

      <Table className="bg-white shadow-xs border-2 border-gray-200 mb-10">
        <TableHeader>
          <TableRow>
            <TableHead className="w-px" />
            <TableHead className="w-[80px]">Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden sm:table-cell">Precio</TableHead>
            <TableHead className="hidden md:table-cell">Categoría</TableHead>
            <TableHead className="hidden md:table-cell">Stock</TableHead>
            <TableHead className="hidden lg:table-cell">Tallas</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data!.products.map((product) => {
            const isExpanded = expandedRow === product.id
            return (
              <React.Fragment key={product.id}>
                <TableRow
                  className="cursor-pointer"
                  onClick={() => toggleRow(product.id)}
                >
                  {/* Chevron */}
                  <TableCell className="w-px pr-0">
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-gray-400 transition-transform duration-200 md:hidden",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </TableCell>

                  {/* Imagen */}
                  <TableCell>
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  </TableCell>

                  {/* Nombre */}
                  <TableCell>
                    <Link
                      to={`/admin/products/${product.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-semibold hover:text-blue-500 hover:underline line-clamp-2 max-sm:text-ellipsis max-sm:w-[140px]"
                    >
                      {product.title}
                    </Link>
                  </TableCell>

                  {/* Precio */}
                  <TableCell className="hidden sm:table-cell">
                    {formatCurrency(product.price, 'CLP')}
                  </TableCell>

                  {/* Categoría */}
                  <TableCell className="hidden md:table-cell">
                    {product.tags?.join(', ')}
                  </TableCell>

                  {/* Stock */}
                  <TableCell className="hidden md:table-cell">
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      product.stock > 5  ? "bg-green-100 text-green-700"
                      : product.stock > 0 ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    )}>
                      {product.stock}
                    </span>
                  </TableCell>

                  {/* Tallas */}
                  <TableCell className="hidden lg:table-cell text-xs text-gray-600">
                    {product.sizes?.join(', ')}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell
                    className="text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link to={`/admin/products/${product.id}`}>
                      <PencilIcon className="w-4 h-4 text-blue-500 mx-auto" />
                    </Link>
                  </TableCell>
                </TableRow>

                {/* Fila colapsable */}
                {isExpanded && (
                  <TableRow className="md:hidden bg-gray-50 hover:bg-gray-50">
                    <TableCell colSpan={8} className="py-3 px-4">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Precio</span>
                          <span className="font-medium">{formatCurrency(product.price, 'CLP')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Categoría</span>
                          <span className="text-gray-700">{product.tags?.join(', ') || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Stock</span>
                          <span className={cn(
                            "font-semibold px-2 py-0.5 rounded-full",
                            product.stock > 5  ? "bg-green-100 text-green-700"
                            : product.stock > 0 ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                          )}>
                            {product.stock}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tallas</span>
                          <span className="text-gray-700">{product.sizes?.join(', ') || '—'}</span>
                        </div>
                        <div className="flex justify-end pt-1">
                          <Link
                            to={`/admin/products/${product.id}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button size="sm" variant="outline" className="h-6 text-xs gap-1">
                              <PencilIcon className="h-3 w-3" />
                              Editar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            )
          })}
        </TableBody>
      </Table>

      <CustomPagination totalPages={data?.pages || 0} />
    </>
  )
}