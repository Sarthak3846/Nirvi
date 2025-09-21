import { useState } from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
// Product type (temporary until @shared/schema is available)
interface Product {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  category?: string;
  description?: string;
  originalPrice?: string;
  colors?: string[];
  sizes?: string[];
  hoverImageSrc?: string;
  isNew?: boolean;
  isSale?: boolean;
}

// Transform backend product to frontend format
function transformProduct(product: Product) {
  return {
    ...product,
    price: parseFloat(product.price),
    originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
    colors: product.colors || [],
    sizes: product.sizes || [],
    hoverImageSrc: product.hoverImageSrc || undefined,
    isNew: product.isNew || false,
    isSale: product.isSale || false,
  };
}

export type TransformedProduct = ReturnType<typeof transformProduct>;

interface ProductGridProps {
  products?: Product[];
  title?: string;
  showFilters?: boolean;
  itemsPerPage?: number;
  category?: string;
  searchQuery?: string;
  onProductClick?: (product: TransformedProduct) => void;
  onAddToCart?: (productId: string) => void;
  onWishlist?: (productId: string) => void;
}

export default function ProductGrid({
  products: propProducts,
  title,
  showFilters = true,
  itemsPerPage = 12,
  category,
  searchQuery,
  onProductClick,
  onAddToCart,
  onWishlist
}: ProductGridProps) {
  // Fetch products from API if not provided via props
  const queryParams = new URLSearchParams();
  if (category) queryParams.set('category', category);
  if (searchQuery) queryParams.set('search', searchQuery);
  const queryString = queryParams.toString();
  
  const { data: fetchedProducts, isLoading, error } = useQuery<Product[]>({
    queryKey: [`/api/products${queryString ? `?${queryString}` : ''}`],
    enabled: !propProducts, // Only fetch if products aren't provided
  });

  const products = propProducts || fetchedProducts || [];
  const transformedProducts = Array.isArray(products) ? products.map((product: Product) => transformProduct(product)) : [];
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique categories (filter out undefined values)
  const categories = ['all', ...Array.from(new Set(transformedProducts.map((p: TransformedProduct) => p.category).filter((cat): cat is string => cat !== undefined)))];

  // Filter and sort products
  const filteredProducts = transformedProducts.filter((product: TransformedProduct) => 
    filterCategory === 'all' || product.category === filterCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return a.isNew ? -1 : 1;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleProductClick = (productId: string) => {
    const product = transformedProducts.find((p: TransformedProduct) => p.id === productId);
    if (product) {
      console.log('Product grid click:', product);
      onProductClick?.(product);
    }
  };

  if (!propProducts && isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted aspect-[3/4] rounded-md mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!propProducts && error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Failed to load products. Please try again.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        {title && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.2em] text-black" data-testid="text-grid-title">
              {title}
            </h2>
          </div>
        )}

        {/* Filters and Sort */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-between items-center border-b border-gray-200 pb-6">
            <div className="flex gap-6">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40 border-0 border-b border-gray-300 rounded-none bg-transparent focus:border-black" data-testid="select-category">
                  <SelectValue placeholder="CATEGORY" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-0 border-b border-gray-300 rounded-none bg-transparent focus:border-black" data-testid="select-sort">
                  <SelectValue placeholder="SORT BY" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">FEATURED</SelectItem>
                  <SelectItem value="newest">NEWEST</SelectItem>
                  <SelectItem value="price-low">PRICE: LOW TO HIGH</SelectItem>
                  <SelectItem value="price-high">PRICE: HIGH TO LOW</SelectItem>
                  <SelectItem value="name">NAME</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600 font-light tracking-wide" data-testid="text-product-count">
              {filteredProducts.length} ITEMS
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 mb-16">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              hoverImageSrc={product.hoverImageSrc || undefined}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
              onClick={handleProductClick}
            />
          ))}
        </div>

        {/* Load More / Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            {currentPage < totalPages && (
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-12 py-3 font-light tracking-widest border-black text-black hover:bg-black hover:text-white"
                data-testid="button-load-more"
              >
                LOAD MORE
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}