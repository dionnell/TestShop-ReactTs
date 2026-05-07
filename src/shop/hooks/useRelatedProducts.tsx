import { useQuery } from "@tanstack/react-query";
import { getRelatedProductsAction } from "../actions/getRelatedProducts.action";

export const useRelatedProducts = (productId: string | undefined, limit = 9) => {
  return useQuery({
    queryKey: ["related-products", productId, limit],
    queryFn: () => getRelatedProductsAction(productId!, limit),
    enabled: !!productId,          // Solo ejecuta si tenemos el ID
    staleTime: 1000 * 60 * 10,    // Cache 10 min — la IA es costosa, evitamos re-llamar
    retry: false,                  // Si falla, el servicio ya tiene fallback propio
  });
};