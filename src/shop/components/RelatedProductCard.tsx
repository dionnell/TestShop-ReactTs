import { Link } from "react-router";

interface RelatedProductCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
  slug: string
}

export const RelatedProductCard = ({ name, price, image, category, slug }: RelatedProductCardProps) => {

  return (
    <article
      className="group cursor-pointer flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg/10 transition-shadow duration-200 w-64 shrink-0 max-sm:w-40"
    >
      {/* Image */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
        />
      </div>
 
      {/* Info */}
      <Link to={`/product/${slug}`}>
        <div className="flex flex-col gap-1 p-3 flex-1">
          <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-snug max-sm:text-xs">
            {name}
          </p>
    
          {/* Stars */}
          <div className="flex text-yellow-400 text-xs mt-auto pt-1">
            {category}
          </div>
    
          {/* Price */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-extrabold text-gray-900">
              ${price?.toLocaleString("es-CL")}
            </span>

          </div>
        </div>
      </Link>
    </article>
  )
}
