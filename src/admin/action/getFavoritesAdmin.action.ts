import { testShopApi } from "@/api/testShopApi"
import type { Product } from "@/interface/product.interface";


interface Options {
    limit? : number | string,
    offset? : number | string,
    query? : string,
}
interface FavoriteItemAdmin {
  id: string;
  createdAt: string;
  favoriteCount: number,
  product: Product;
}
export interface GetFavoritesAdminResponse {
  count: number;
  favorites: FavoriteItemAdmin[];
  pages: number,
}

export const getFavoritesAdminAction = async(options: Options): Promise<GetFavoritesAdminResponse> => {
    
    const {limit, offset, query} = options

    const {data} = await testShopApi.get<GetFavoritesAdminResponse>('/favorites/admin/group', {
        params: {
            limit,
            offset, 
            q: query
        }
    }) 

    const productsWithImage = data.favorites.map(favorites => ({
        ...favorites,
        images: favorites.product.images.map(
            image => `${import.meta.env.VITE_API_URL}/files/product/${image}`
        )
    }))

    return {
        ...data,
        favorites: productsWithImage,
    }
}