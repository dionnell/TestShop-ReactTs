import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { ShoppingCartIcon, Heart, HeartOff } from "lucide-react";

import { useProductShop } from "@/shop/hooks/useProductShop"
import { useFavorite } from "@/shop/hooks/useFavorite";
import { useAuthStore } from "@/auth/store/auth.store";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { RelatedProducts } from "@/shop/components/RelatedProducts";
import { addFavorite } from "@/shop/actions/addFavorite.action";
import { removeFavorite } from "@/shop/actions/removeFavorite.action";


export const ProductPage = () => {
  const { idSlug } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useProductShop(idSlug || '');
  
  const { data: isFavoriteServer } = useFavorite(product?.id ?? '');
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (isFavoriteServer !== undefined) {
      setIsFavorite(isFavoriteServer);
    }
  }, [isFavoriteServer]);

  if (isLoading) return <CustomFullScreenLoading />;
  if (isError || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Producto no encontrado.</p>
      </div>
    );
  }

  const handleAddFavorite = async () => {
    if(!user){
      navigate('/auth/login')
      return
    }

    try {
      setIsLoadingFavorite(true);
      await addFavorite(product.id);
      setIsFavorite(true); // 👈 actualiza el ícono inmediatamente
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setIsFavorite(true); // ya existía, igual marca como favorito
        return;
      }
      console.error(error);
    } finally {
      setIsLoadingFavorite(false)
    }
  }

  const handleDeleteFavorite = async (productId: string) => {
    if(!user){
      navigate('/auth/login')
      return
    }
    try {
      setIsLoadingFavorite(true);
      await removeFavorite(productId);
      setIsFavorite(false); // 👈 actualiza el ícono inmediatamente
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoadingFavorite(false);
    }
  }

  const handleCart = () => {
    if(!user){
      navigate('/auth/login')
    }
  }

  return (
    <div className="bg-white min-h-screen mt-5">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="text-xs text-gray-500 flex gap-1 flex-wrap">
          <Link
            to={`/`}
          >
            <span className="hover:underline cursor-pointer">Inicio</span>
          </Link>
          
          <span>/</span>
          <Link
            to={`/gender/${product.gender}`}
          >
            <span className="hover:underline cursor-pointer capitalize">{product.gender || "Categoría"}</span>
          </Link>
          
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{product.title}</span>
        </nav>
      </div>
 
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
 
          {/* LEFT — Image Gallery */}
          <div className="flex gap-3">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 w-16 shrink-0">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`border-2 rounded overflow-hidden transition-all ${
                    selectedImage === i
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    className="w-full aspect-square object-cover cursor-pointer"
                  />
                </button>
              ))}
            </div>
 
            {/* Main Image */}
            <div className="flex-1 relative overflow-hidden rounded-lg border border-gray-100 bg-gray-50 shadow-md">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full aspect-square object-contain p-4 transition-all duration-300 hover:scale-150 cursor-pointer"
              />
            </div>
          </div>
  
          {/* RIGHT — Product Info */}
          <div className="flex flex-col gap-4">
            {/* Brand & Title */}
            <div>
              {/* {product.brand && (
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">
                  {product.brand}
                </p>
              )} */}
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
            </div>
 
            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                ${product.price?.toLocaleString("es-CL")}
              </span>
            </div>
 
            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Talla:{" "}
                  <span className="font-normal text-gray-500">
                    {selectedSize ?? "Selecciona una talla"}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] h-10 px-3 rounded border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-700 hover:border-gray-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
 
            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 text-lg font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  −
                </button>
                <span className="w-10 h-11 flex items-center justify-center text-sm font-semibold border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || Infinity, q + 1))}
                  className="w-10 h-11 text-lg font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
 
              <button 
                className="flex items-center justify-center h-11 px-4 bg-black text-white font-semibold rounded-4xl hover:bg-gray-800 transition-all text-sm tracking-wide cursor-pointer"
                onClick={handleCart}  
              >
                <ShoppingCartIcon className="mr-2"/> Agregar al carro
              </button>

                <button 
                  className={`h-11 w-10 flex items-center justify-center font-semibold rounded-4xl transition-all text-sm tracking-wide cursor-pointer ${
                  isFavorite 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-black text-white hover:bg-gray-800'
                  } ${isLoadingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={!isFavorite ? handleAddFavorite : () => handleDeleteFavorite(product.id)}
                  disabled={isLoadingFavorite}
                >
                  {!isFavorite ? (
                    <Heart  />
                    ):
                    <HeartOff fill="currentColor" /> 
                  }
                </button> 
              
            </div>
              
 
            {/* Divider */}
            <hr className="border-gray-200 my-1" />
 
            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  Descripción
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                  {product.description}
                </p>
              </div>
            )}
 
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
 
            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
              {product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  <span className="text-green-700 font-medium">
                    En stock ({product.stock} disponibles)
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  <span className="text-red-600 font-medium">Sin stock</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 my-1" />

      <div>
        {/* Aquí podrías agregar una sección de productos relacionados o recomendaciones */}
        <div className="border-t border-gray-100 mt-6">
          <RelatedProducts
            gender={product.gender ?? ""}
            currentSlug={idSlug ?? ""}
          />
        </div>
      </div>

    </div>
    
  )
}
