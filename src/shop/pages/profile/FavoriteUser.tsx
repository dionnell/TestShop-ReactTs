
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getFavorites, type FavoriteItem } from "@/shop/actions/getFavorites.action";
import { removeFavorite } from "@/shop/actions/removeFavorite.action";

export const FavoriteUser = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const { favorites } = await getFavorites();
        setFavorites(favorites);
      } catch (err) {
        setError("No se pudieron cargar los favoritos. Intenta de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      await removeFavorite(productId);
      setFavorites((current) => current.filter((item) => item.product.id !== productId));
    } catch (err) {
      setError("No se pudo eliminar el producto. Vuelve a intentarlo.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-100 mt-4 rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Productos favoritos</h1>

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
          Cargando favoritos...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      ) : favorites.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
          No tienes productos favoritos aún.
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
              {favorites.map((favorite) => (
                <tr key={favorite.id}>
                  <td className="px-6 py-4 align-top">
                    <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={favorite.product.images?.[0] ?? "https://via.placeholder.com/150"}
                        alt={favorite.product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <p className="font-semibold text-gray-900 line-clamp-2 md:text-sm ">{favorite.product.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-3">
                      {favorite.product.description}
                    </p>
                    <span className="inline-block bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full mt-2">
                      ${favorite.product.price?.toLocaleString("es-CL")}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top text-right">
                    <button
                      type="button"
                      onClick={() => handleRemove(favorite.product.id)}
                      disabled={removingId === favorite.product.id}
                      className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
