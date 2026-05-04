import { AdminTitle } from "@/admin/components/AdminTitle"
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/currency-formatter"
import { useFavoritesCount } from "@/shop/hooks/useFavorites"
import { ChevronDown } from "lucide-react"
import { Link } from "react-router"
import { useState } from "react"
import React from "react"
import { cn } from "@/lib/utils"

export const FavoritesAdmin = () => {
  const { data, isLoading, isError } = useFavoritesCount()
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleRow = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id)
  }

  if (isLoading) return <CustomFullScreenLoading />

  if (isError || !data) {
    return (
      <div className="p-6 text-center text-red-500">
        No se pudieron cargar los favoritos. Intenta de nuevo.
      </div>
    )
  }

  return (
    <>
      <AdminTitle
        title="Favoritos"
        subtitle="Aqui puedes ver la cantidad de veces que un producto ha sido marcado como favorito por los usuarios"
      />

      <Table className="bg-white shadow-xs border-2 border-gray-200 mb-10">
        <TableHeader>
          <TableRow>
            <TableHead className="w-px" />
            <TableHead className="w-[80px]">Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden sm:table-cell">Precio</TableHead>
            <TableHead className="hidden md:table-cell">Categoría</TableHead>
            <TableHead className="hidden md:table-cell">Stock</TableHead>
            <TableHead className="text-center">Favoritos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.favorites.map((item) => {
            const isExpanded = expandedRow === item.id
            return (
              <React.Fragment key={item.id}>
                <TableRow
                  className="cursor-pointer"
                  onClick={() => toggleRow(item.id)}
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
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  </TableCell>

                  {/* Nombre */}
                  <TableCell>
                    <Link
                      to={`/admin/products/${item.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-semibold hover:text-blue-500 hover:underline line-clamp-2 max-sm:text-ellipsis max-sm:w-[140px]"
                    >
                      {item.product.title}
                    </Link>
                  </TableCell>

                  {/* Precio */}
                  <TableCell className="hidden sm:table-cell">
                    {formatCurrency(item.product.price, 'CLP')}
                  </TableCell>

                  {/* Categoría */}
                  <TableCell className="hidden md:table-cell">
                    {item.product.tags?.join(', ')}
                  </TableCell>

                  {/* Stock */}
                  <TableCell className="hidden md:table-cell">
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      item.product.stock > 5  ? "bg-green-100 text-green-700"
                      : item.product.stock > 0 ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    )}>
                      {item.product.stock}
                    </span>
                  </TableCell>

                  {/* Favoritos */}
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-red-50 text-red-600 font-semibold text-sm">
                      {item.favoriteCount}
                    </span>
                  </TableCell>
                </TableRow>

                {/* Fila colapsable */}
                {isExpanded && (
                  <TableRow className="md:hidden bg-gray-50 hover:bg-gray-50">
                    <TableCell colSpan={7} className="py-3 px-4">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Precio</span>
                          <span className="font-medium">{formatCurrency(item.product.price, 'CLP')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Categoría</span>
                          <span className="text-gray-700">{item.product.tags?.join(', ') || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Stock</span>
                          <span className={cn(
                            "font-semibold px-2 py-0.5 rounded-full",
                            item.product.stock > 5  ? "bg-green-100 text-green-700"
                            : item.product.stock > 0 ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                          )}>
                            {item.product.stock}
                          </span>
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