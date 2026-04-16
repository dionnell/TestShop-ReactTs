import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Size } from "@/interface/product.interface";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string[];
  category: string;
  size: Size[]
  slug: string
}
 
export const ProductCard = ({ 
    name, price, image, category , size, slug
}: ProductCardProps) => {

  const [currentIndex, setCurrentIndex] = useState(0)

  const prev = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i - 1 + image.length) % image.length);
  }, [image.length]);

  const next = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i + 1) % image.length);
  }, [image.length]);

  const hasManyImages = image.length > 1;

  return (
    <Card className="group border-0 shadow-none product-card-hover cursor-pointer">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted rounded-lg">
          {/* Track deslizante */}
          {image.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(${(i - currentIndex) * 100}%)` }}
            >
              <img
                src={src}
                alt={`${name} ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}

          <div className="image-overlay" />

          {/* Flechas (solo si hay más de 1 imagen) */}
          {hasManyImages && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-sm"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-sm"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-4 w-4 text-gray-700" />
              </button>
            </>
          )}

          {/* Dots indicadores */}
          {hasManyImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {image.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"
                  }`}
                  aria-label={`Ir a imagen ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
         
        <div className="pt-6 px-4 pb-4 space-y-3">
          <Link
            to={`/product/${slug}`}
          >
            <div className="space-y-1">
              <h3 className="font-medium text-sm tracking-tight">{name}</h3>
              <p className="text-xs text-muted-foreground uppercase">{category} - 
                <span className="font-bold">
                  {size.join(", ")}
                </span> </p>
            </div>
          </Link>
          
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg">${price}</p>
            <Button 
              size="sm" 
              variant="outline"
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground border-primary/20 text-xs px-4 py-2 h-8"
            >
              Agregar al carrito
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

