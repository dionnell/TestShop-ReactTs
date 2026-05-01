import { ShoppingBag, Package, ChevronRight } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useMyPayments } from "@/shop/hooks/usePayment"
import { formatCurrency } from "@/lib/currency-formatter"

export const HistoryUser = () => {
  const { data: payments, isLoading, isError, error } = useMyPayments()

  // Loading 
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="h-6 w-6" />
          <Skeleton className="h-7 w-48" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    )
  }

  // Error 
  if (isError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <Package className="mx-auto h-10 w-10 text-red-400 mb-3" />
          <p className="font-semibold text-red-700">No se pudo cargar el historial</p>
          <p className="text-sm text-red-500 mt-1">
            {error instanceof Error ? error.message : "Intenta de nuevo más tarde."}
          </p>
        </div>
      </div>
    )
  }

  // Empty 
  if (!payments || payments.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Mis compras</h1>
        </div>
        <div className="rounded-2xl border bg-white p-14 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag className="h-7 w-7 text-gray-400" />
          </div>
          <h2 className="font-semibold text-gray-800 mb-1">No tienes compras aún</h2>
          <p className="text-sm text-gray-500 mb-5">Cuando realices una compra aparecerá aquí.</p>
          <Button asChild size="sm">
            <Link to="/">
              Ir a la tienda <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Mis compras</h1>
        <Badge variant="secondary" className="text-xs px-2 py-0.5 ml-1">
          {payments.length} {payments.length === 1 ? "orden" : "órdenes"}
        </Badge>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => {
          return (
            <div
              key={payment.id}
              className="rounded-2xl border bg-white overflow-hidden"
            >
              {/* Order header */}
              <div className="px-5 py-4 border-b bg-gray-50 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-bold">
                    Orden:{" "}
                    <span className="font-mono text-gray-700">{payment.buyOrder}</span>
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-gray-900">
                    {formatCurrency(payment.amount, 'CLP')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString("es-CL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y">
                {payment.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 items-center">
                    {/* Image */}
                    <div className="shrink-0 h-14 w-14 rounded-xl overflow-hidden bg-gray-100">
                      {item.product ? (
                        <Link to={`/product/${item.product.slug}`}>
                          <img
                            src={item.product.images?.[0] ?? "https://placehold.co/56"}
                            alt={item.product.title}
                            className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </Link>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {item.product ? (
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="text-sm font-semibold text-gray-900 hover:underline line-clamp-1"
                        >
                          {item.product.title}
                        </Link>
                      ) : (
                        <p className="text-sm font-semibold text-gray-400 italic">
                          Producto eliminado
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">
                        Talla: {item.size} · x{item.quantity}
                      </p>
                    </div>

                    {/* Subtotal */}
                    <p className="text-sm font-semibold text-gray-900 shrink-0">
                      {formatCurrency(item.subtotal, 'CLP')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}