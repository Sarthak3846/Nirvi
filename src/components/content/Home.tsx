// import { useState } from "react";
import Header from "@/components/content/Header";
import Hero from "@/components/content/Hero";
import ProductGrid, { TransformedProduct } from "@/components/content/ProductGrid";
import Footer from "@/components/content/Footer";
// import Cart, { CartItem } from "@/components/Cart";
import ThemeToggle from "@/components/content/ThemeToggle";
import { useQuery } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";
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

// API Cart Item type (what the backend returns)
interface ApiCartItem {
  id: string;
  sessionId: string;
  productId: string;
  quantity: number;
  selectedSize: string | null;
  selectedColor: string | null;
  product: Product;
}

// Cart Item type (temporary until Cart component is available)
interface CartItem {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  size?: string;
  color?: string;
  quantity: number;
}

// Transform API cart item to UI cart item
function transformCartItem(apiItem: ApiCartItem): CartItem {
  return {
    id: apiItem.id,
    name: apiItem.product.name,
    price: parseFloat(apiItem.product.price),
    imageSrc: apiItem.product.imageSrc,
    size: apiItem.selectedSize || undefined,
    color: apiItem.selectedColor || undefined,
    quantity: apiItem.quantity,
  };
}

// Import generated images
import heroImage from "@assets/generated_images/Woman_in_cream_wool_dress_a81cf69d.png";

export default function Home() {
  // Cart functionality temporarily disabled
  const handleCartClick = () => {
    console.log('Cart clicked - functionality temporarily disabled');
  };

  // Fetch cart items from API
  const { data: apiCartItems = [] } = useQuery<ApiCartItem[]>({
    queryKey: ["/api/cart"],
  });

  // Transform API cart items to UI cart items
  const cartItems: CartItem[] = apiCartItems.map(transformCartItem);

  // Add to cart mutation - temporarily disabled
  /*
  const addToCartMutation = useMutation({
    mutationFn: async (data: {
      productId: string;
      quantity?: number;
      selectedSize?: string;
      selectedColor?: string;
    }) => {
      return apiRequest("POST", "/api/cart/add", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  // Update cart item mutation
  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  // Remove cart item mutation
  const removeCartMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });
  */

  const handleAddToCart = (productId: string) => {
    // Temporarily disabled - mutations commented out
    // addToCartMutation.mutate({
    //   productId,
    //   quantity: 1,
    // });
    console.log("Added to cart:", productId);
  };

  // Cart functions temporarily disabled
  // const handleUpdateCartQuantity = (id: string, quantity: number) => {
  //   console.log("Update cart quantity:", id, quantity);
  // };

  // const handleRemoveFromCart = (id: string) => {
  //   console.log("Remove from cart:", id);
  // };

  const handleProductClick = (product: TransformedProduct) => {
    console.log("Product clicked:", product);
    // In a real app, this would navigate to a product detail page
  };

  const handleWishlist = (productId: string) => {
    console.log("Wishlist toggled:", productId);
    // In a real app, this would toggle wishlist status
  };

  const handleSearchSubmit = (query: string) => {
    console.log("Search submitted:", query);
    // In a real app, this would trigger search functionality
  };

  const totalCartItems = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <Header
        cartItemCount={totalCartItems}
        onCartClick={handleCartClick}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-20 right-4 z-40">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <Hero
        imageSrc={heroImage.src}
        title="NIRVI"
        subtitle="Discover our new collection featuring contemporary designs for the modern wardrobe"
        ctaText="EXPLORE COLLECTION"
        onCtaClick={() => {
          // Scroll to products section
          const element = document.getElementById("products");
          element?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Featured Products Section */}
      <div id="products">
        <ProductGrid
          title="NEW ARRIVALS"
          showFilters={true}
          itemsPerPage={8}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          onWishlist={handleWishlist}
        />
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}
