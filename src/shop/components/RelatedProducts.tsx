import { useCallback, useEffect, useRef, useState } from "react"
import { useProductsByGender } from "../hooks/useProductByGender"
import { RelatedProductCard } from "./RelatedProductCard"
import { SkeletonCardLoading } from "./SkeletonCardLoading"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

interface Props {
  gender: string
  currentSlug: string
}

export const RelatedProducts = ({ gender, currentSlug }: Props) => {
  const { data: products, isLoading } = useProductsByGender(gender, currentSlug)
 
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
 
  const SCROLL_AMOUNT = 228 * 2 // ~2 cards per click
 
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
 
  const scroll = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({
      left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    })
  }
 

  if (!isLoading && (!products || products.length === 0)) return null
 
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          También podría interesarte
        </h2>
      </div>
 
      
      {/* Carousel */}
      <div className="relative">
        <button 
            onClick={() => scroll("left")} 
            disabled={!canScrollLeft}
            className={`absolute top-1/2 -translate-y-1/2 z-10 -left-4 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md
                        flex items-center justify-center transition-all duration-150
                        ${canScrollLeft ? "opacity-0 pointer-events-none" : "hover:bg-gray-50 hover:shadow-lg"}
                    `}
        >
            <ArrowLeftIcon />
        </button>
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCardLoading key={i} />)
            : products?.map((product) => (
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
            className={`absolute top-1/2 -translate-y-1/2 z-10 -right-4 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md
                        flex items-center justify-center transition-all duration-150
                        ${canScrollRight ? "opacity-0 pointer-events-none" : "hover:bg-gray-50 hover:shadow-lg"}
                    `}
        >
            <ArrowRightIcon />
        </button>
      </div>
    </section>
  )
}