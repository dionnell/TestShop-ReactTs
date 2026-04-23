import { Heart, Trash2, Package, ChevronRight } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useFavorites } from "@/shop/hooks/useFavorites"
import { Skeleton } from "@/components/ui/skeleton"
import { FavoriteItemSkeleton } from "@/shop/components/FavoriteItemSkeleton"


export const FavoriteUser = () => {
  const {
    isLoading,
    isError,
    error,
    data,
    removeFavorite,
    isRemoving,
    removingId,
  } = useFavorites()

  const favorites = data?.favorites ?? []
  const count = favorites.length

  // Loading 
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="h-6 w-6" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="rounded-2xl border bg-white divide-y">
          {[1, 2, 3].map((i) => <FavoriteItemSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  //  Error  
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <Package className="mx-auto h-10 w-10 text-red-400 mb-3" />
          <p className="font-semibold text-red-700">No se pudieron cargar los favoritos</p>
          <p className="text-sm text-red-500 mt-1">
            {error instanceof Error ? error.message : "Intenta de nuevo más tarde."}
          </p>
        </div>
      </div>
    )
  }

  //  Empty  
  if (favorites.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Mis favoritos</h1>
        </div>
        <div className="rounded-2xl border bg-white p-14 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Heart className="h-7 w-7 text-gray-400" />
          </div>
          <h2 className="font-semibold text-gray-800 mb-1">No tienes favoritos aún</h2>
          <p className="text-sm text-gray-500 mb-5">Guarda productos que te interesen para verlos después.</p>
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
        <Heart className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Mis favoritos</h1>
        <Badge variant="secondary" className="text-xs px-2 py-0.5 ml-1">
          {count}
        </Badge>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden">
        {/* Card header */}
        <div className="px-5 py-4 border-b bg-gray-50">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            {count} {count === 1 ? "producto guardado" : "productos guardados"}
          </p>
        </div>

        <div className="divide-y">
          {favorites.map((favorite) => {
            const isBeingRemoved = removingId === favorite.product.id && isRemoving

            return (
              <div
                key={favorite.id}
                className={`flex gap-4 p-5 transition-opacity duration-200 ${isBeingRemoved ? "opacity-40" : ""}`}
              >
                <div className="flex items-start gap-4 flex-1 max-sm:grid max-sm:grid-cols-3">
                  {/* Image */}
                  <Link
                    to={`/product/${favorite.product.slug}`}
                    className="shrink-0 h-24 w-24 rounded-xl overflow-hidden bg-gray-100 block max-sm:h-32 max-sm:w-32"
                  >
                    <img
                      src={favorite.product.images?.[0] ?? "https://placehold.co/96"}
                      alt={favorite.product.title}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 max-sm:col-span-2">
                    <Link
                      to={`/product/${favorite.product.slug}`}
                      className="text-sm font-semibold text-gray-900 line-clamp-2 hover:underline"
                    >
                      {favorite.product.title}
                    </Link>

                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {favorite.product.gender && (
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5 font-medium capitalize">
                          {favorite.product.gender}
                        </span>
                      )}
                      {favorite.product.tags?.[0] && (
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5 font-medium capitalize">
                          {favorite.product.tags[0]}
                        </span>
                      )}
                    </div>

                    <p className="text-base font-bold text-gray-900 mt-1">
                      ${favorite.product.price?.toLocaleString("es-CL")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end justify-center shrink-0 gap-2">
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
                        <AlertDialogTitle>¿Eliminar de favoritos?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Se eliminará "{favorite.product.title}" de tu lista de favoritos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeFavorite(favorite.product.id)}
                          variant="destructive"
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
    </div>
  )
}