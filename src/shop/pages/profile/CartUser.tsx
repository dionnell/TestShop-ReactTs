import { Minus, Plus, Trash2, ShoppingCart, Package, ChevronRight } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/shop/hooks/useCart"
import { Skeleton } from "@/components/ui/skeleton"
import { CartItemSkeleton } from "@/shop/components/CartItemSkeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"


export const CartUser = () => {
  const {
    isLoading,
    isError,
    error,
    data,
    removeFromCart,
    isRemoving,
    removingId,
    updateCartItem,
    isUpdating,
  } = useCart()
 
  const items = data?.items ?? []
  const count = data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  const total = data?.total ?? 0
  const SHIPPING_THRESHOLD = 50000
  const shipping = total >= SHIPPING_THRESHOLD || total === 0 ? 0 : 3990
  const finalTotal = total + shipping
 
  // ── Loading state 
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="h-6 w-6" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          <div className="rounded-2xl border bg-white divide-y">
            {[1, 2, 3].map((i) => <CartItemSkeleton key={i} />)}
          </div>
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    )
  }
 
  // ── Error state 
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <Package className="mx-auto h-10 w-10 text-red-400 mb-3" />
          <p className="font-semibold text-red-700">No se pudo cargar el carro</p>
          <p className="text-sm text-red-500 mt-1">
            {error instanceof Error ? error.message : "Intenta de nuevo más tarde."}
          </p>
        </div>
      </div>
    )
  }
 
  // ── Empty state 
  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Carro de compras</h1>
        </div>
        <div className="rounded-2xl border bg-white p-14 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <ShoppingCart className="h-7 w-7 text-gray-400" />
          </div>
          <h2 className="font-semibold text-gray-800 mb-1">Tu carro está vacío</h2>
          <p className="text-sm text-gray-500 mb-5">Agrega productos para comenzar tu compra.</p>
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Carro de compras</h1>
        <Badge variant="secondary" className="text-xs px-2 py-0.5 ml-1">
          {count}
        </Badge>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
 
        {/* ── Left: item list ── */}
        <div className="rounded-2xl border bg-white overflow-hidden">
          {/* Card header */}
          <div className="px-5 py-4 border-b bg-gray-50">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              {count} {count === 1 ? "producto" : "productos"} en tu carro
            </p>
          </div>
 
          <div className="divide-y">
            {items.map((item) => {
              const isBeingRemoved = removingId === item.id && isRemoving
 
              return (
                <div
                  key={item.id}
                  className={`flex gap-4 p-5 transition-opacity duration-200 ${isBeingRemoved ? "opacity-40" : ""}`}
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="shrink-0 h-24 w-24 rounded-xl overflow-hidden bg-gray-100 block"
                  >
                    <img
                      src={item.product.images?.[0] ?? "https://placehold.co/96"}
                      alt={item.product.title}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </Link>
 
                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="text-sm font-semibold text-gray-900 line-clamp-2 hover:underline"
                    >
                      {item.product.title}
                    </Link>
 
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {item.size && (
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5 font-medium">
                          Talla: {item.size}
                        </span>
                      )}
                      {item.product.gender && (
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5 font-medium capitalize">
                          {item.product.gender}
                        </span>
                      )}
                      {item.product.tags?.[0] && (
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5 font-medium capitalize">
                          {item.product.tags?.[0] }
                        </span>
                      )}
                    </div>
 
                    <p className="text-base font-bold text-gray-900 mt-1">
                      ${item.subtotal.toLocaleString("es-CL")}
                    </p>
 
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-400">
                        ${item.product.price?.toLocaleString("es-CL")} c/u
                      </p>
                    )}
                  </div>
 
                  {/* Actions */}
                  <div className="flex flex-col items-end justify-between shrink-0 gap-2">
                    {/* Quantity control */}
                    <div className="flex items-center gap-1.5 border rounded-full px-2 py-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        disabled={item.quantity <= 1 || isUpdating}
                        onClick={() =>
                          updateCartItem({ itemId: item.id, quantity: item.quantity - 1 })
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-semibold min-w-[18px] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        disabled={isUpdating}
                        onClick={() =>
                          updateCartItem({ itemId: item.id, quantity: item.quantity + 1 })
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
 
                    {/* Remove button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 gap-1"
                          disabled={isBeingRemoved}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Desea eliminar este producto del carro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Una vez eliminado, no podrás recuperar este producto.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeFromCart(item.id)}
                            variant='destructive'
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </div>
              )
            })}
          </div>
        </div>
 
        {/* ── Right: summary ── */}
        <div className="rounded-2xl border bg-white p-5 sticky top-20">
          <h2 className="text-base font-bold text-gray-900 mb-4">Resumen de compra</h2>
 
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({count} {count === 1 ? "producto" : "productos"})</span>
              <span className="font-semibold text-gray-900">${total.toLocaleString("es-CL")}</span>
            </div>
 
            <div className="flex justify-between text-gray-600">
              <span>Despacho</span>
              <span className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                {shipping === 0 ? "¡Gratis!" : `$${shipping.toLocaleString("es-CL")}`}
              </span>
            </div>
          </div>
 
          <Separator className="my-4" />
 
          <div className="flex justify-between items-center font-bold text-base">
            <span>Total</span>
            <span>${finalTotal.toLocaleString("es-CL")}</span>
          </div>
 
          <Button className="w-full mt-4 rounded-xl h-11 text-sm" disabled={count === 0}>
            Ir a pagar
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
 
          <p className="text-center text-xs text-gray-400 mt-3">🔒 Compra segura y protegida</p>
        </div>
 
      </div>
    </div>
  )
}