import { useCallback, useEffect, useRef, useState } from "react"
import { RelatedProductCard } from "./RelatedProductCard"
import { SkeletonCardLoading } from "./SkeletonCardLoading"
import { ArrowLeftIcon, ArrowRightIcon, Sparkles } from "lucide-react"
import { useRelatedProducts } from "../hooks/useRelatedProducts"

interface Props {
  // Cambia: antes recibía gender+currentSlug, ahora recibe productId
  productId: string | undefined
  currentSlug: string
}

export const RelatedProductsWithIA = ({ productId, currentSlug }: Props) => {
  const { data: products, isLoading } = useRelatedProducts(productId)

  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024)

  const SCROLL_AMOUNT = isSmallScreen ? 250 : 224 * 2

  const checkScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll, { passive: true })
    return () => el.removeEventListener("scroll", checkScroll)
  }, [checkScroll, products])

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1024)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const scroll = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({
      left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    })
  }

  // Filtrar el producto actual por si acaso (el backend ya lo excluye, pero por seguridad)
  const filteredProducts = products?.filter((p) => p.slug !== currentSlug) ?? []

  if (!isLoading && filteredProducts.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          También podría interesarte
        </h2>
        {/* Badge que indica que es IA — transparencia hacia el usuario */}
        <span className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
          <Sparkles className="h-3 w-3" />
          Sugerido por IA
        </span>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden mx-auto w-[90%] lg:w-[1184px]">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`absolute top-1/2 -translate-y-1/2 z-50 -left-0.5 ml-1 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md
            flex items-center justify-center transition-all duration-150
            ${!canScrollLeft ? "opacity-0 pointer-events-none" : "hover:bg-gray-50 hover:shadow-lg"}`}
        >
          <ArrowLeftIcon />
        </button>

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCardLoading key={i} />)
            : filteredProducts.map((product) => (
                <RelatedProductCard
                  key={product.id}
                  name={product.title}
                  price={product.price}
                  image={product.images[0]}
                  category={product.tags[0]}
                  slug={product.slug}
                />
              ))}
        </div>

        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`absolute top-1/2 -translate-y-1/2 z-10 -right-0.5 mr-1 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md
            flex items-center justify-center transition-all duration-150
            ${!canScrollRight ? "opacity-0 pointer-events-none" : "hover:bg-gray-50 hover:shadow-lg"}`}
        >
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  )
}