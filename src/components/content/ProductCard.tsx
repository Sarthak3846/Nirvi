import { useState } from 'react';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageSrc: string;
  hoverImageSrc?: string;
  isNew?: boolean;
  isSale?: boolean;
  colors?: string[];
  sizes?: string[];
  onAddToCart?: (id: string) => void;
  onWishlist?: (id: string) => void;
  onClick?: (id: string) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageSrc,
  hoverImageSrc,
  isNew,
  isSale,
  colors = [],
  sizes = [],
  onAddToCart,
  onWishlist,
  onClick
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Added to cart:', id);
    onAddToCart?.(id);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    console.log('Wishlist toggled:', id);
    onWishlist?.(id);
  };

  const handleClick = () => {
    console.log('Product clicked:', id);
    onClick?.(id);
  };

  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      data-testid={`card-product-${id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
        <Image
          src={isHovered && hoverImageSrc ? hoverImageSrc : imageSrc}
          alt={name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          data-testid={`img-product-${id}`}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-black text-white text-xs px-2 py-1 font-light tracking-wider" data-testid={`badge-new-${id}`}>
              NEW
            </span>
          )}
          {isSale && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 font-light tracking-wider" data-testid={`badge-sale-${id}`}>
              SALE
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            isWishlisted ? 'text-red-500' : 'text-black'
          } hover:bg-white/80 bg-white/60 backdrop-blur-sm`}
          onClick={handleWishlist}
          data-testid={`button-wishlist-${id}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>

        {/* Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-black text-white hover:bg-gray-800 rounded-none py-3 text-xs font-medium tracking-widest"
            data-testid={`button-add-cart-${id}`}
          >
            ADD TO CART
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="font-light text-sm tracking-wide text-black group-hover:opacity-70 transition-opacity" data-testid={`text-product-name-${id}`}>
          {name.toUpperCase()}
        </h3>
        
        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="font-light text-black text-sm" data-testid={`text-price-${id}`}>
            ${price.toFixed(2)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-gray-500 line-through" data-testid={`text-original-price-${id}`}>
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="flex space-x-1 pt-1">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-3 h-3 rounded-full border ${
                  selectedColor === color ? 'border-black border-2' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                data-testid={`button-color-${id}-${color}`}
              />
            ))}
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="flex space-x-2 pt-1">
            {sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="text-xs text-gray-500 font-light"
                data-testid={`text-size-${id}-${size}`}
              >
                {size}
              </span>
            ))}
            {sizes.length > 4 && (
              <span className="text-xs text-gray-500 font-light">
                +{sizes.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}