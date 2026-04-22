import { useCart } from "@/shop/hooks/useCart"
import { Trash2 } from "lucide-react"
import { Link } from "react-router"


export const CartUser = () => {

  const {isLoading, isError, error, data: product} = useCart()
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-100 mt-4 rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 md:text-xl">Carrito de Compras ({product?.cart.length ?? 0})</h1>

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
          Cargando Carrito de Compras...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          {error instanceof Error ? error.message : "No se pudieron cargar los productos del carrito. Intenta de nuevo más tarde."}
        </div>
      ) : product?.cart.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
          No tienes productos en el carrito aún.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Imagen
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Producto
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {product?.map((cart) => (
                <tr key={cart.id}>
                  <td className="px-6 py-4 align-top">
                    <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={cart.product.images?.[0] ?? "https://via.placeholder.com/150"}
                        alt={cart.product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <Link to={`/product/${cart.product.slug}`} >
                      <p className="font-semibold text-gray-900 line-clamp-2 max-md:text-xs ">{cart.product.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-3 max-md:text-xs">
                        {cart.product.description}
                      </p>
                      <span className="inline-block bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full mt-2">
                        ${cart.product.price?.toLocaleString("es-CL")}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 align-top text-right">
                    <button
                      type="button"
                      
                      className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
