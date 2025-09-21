"use client";

import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../content/Header';
// import Hero from '../content/Hero';
import ProductGrid from '../content/ProductGrid';
import Footer from '../content/Footer';
import LoginModal from '../content/LoginModal';
import { useAuth } from '../providers/AuthProvider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail } from 'lucide-react';
import Image from 'next/image';

// Main HomePage component
const HomePage: FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [email, setEmail] = useState('');

  const handleAddToCart = (productId: string) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setCartItems(prev => [...prev, productId]);
      console.log('Added to cart:', productId);
      // Here you would typically make an API call to add the item to the user's cart
    }
  };

  const handleCartClick = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      // Navigate to cart or show cart sidebar
      console.log('Show cart');
    }
  };

  const handleLoginSuccess = () => {
    // Wait for auth state to update, then redirect to user profile
    setTimeout(() => {
      if (user) {
        router.push(`/${user.id}`);
      } else {
        // If user state hasn't updated yet, refresh the page
        window.location.reload();
      }
    }, 500);
  };
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    // Here you would typically make an API call to subscribe the email
    // For now, we'll just show a success message and clear the input
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };
  
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="min-h-screen bg-white">
        {/* Fixed Header */}
        <Header
          cartItemCount={cartItems.length}
          onCartClick={handleCartClick}
          onLoginClick={() => setShowLoginModal(true)}
        />

        {/* Hero Section - Modern Zara Style */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/attached_assets/generated_images/Woman_in_cream_wool_dress_a81cf69d.png"
              alt="NIRVI Collection"
              className="w-full h-full object-cover"
              width={100}
              height={100}
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-6xl md:text-8xl font-thin tracking-[0.2em] mb-6">
              NIRVI
            </h1>
            <p className="text-lg md:text-xl font-light tracking-wide mb-8 max-w-2xl mx-auto">
              Contemporary fashion for the modern individual
            </p>
            <button
              onClick={() => {
                const element = document.getElementById("products");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white text-black px-8 py-3 text-sm font-medium tracking-widest hover:bg-gray-100 transition-colors"
            >
              SHOP NOW
            </button>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop"
                    alt="Women"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-light tracking-widest text-center">WOMEN</h3>
              </div>
              
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"
                    alt="Men"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-light tracking-widest text-center">MEN</h3>
              </div>
              
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=600&fit=crop"
                    alt="Kids"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-light tracking-widest text-center">KIDS</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <div id="products">
          <ProductGrid
            title="NEW ARRIVALS"
            showFilters={true}
            itemsPerPage={12}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Newsletter Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-light tracking-widest mb-4">STAY UPDATED</h2>
            <p className="text-gray-600 mb-8">Be the first to know about new collections and exclusive offers</p>
            <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
              data-testid="input-newsletter-email"
            />
            <Button 
              type="submit" 
              className="px-6"
              data-testid="button-newsletter-subscribe"
            >
              <Mail className="h-4 w-4" />
            </Button>
          </form>
          </div>
        </section>

        {/* Footer */}
        <Footer />

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)} 
            onSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
