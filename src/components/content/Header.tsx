import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../providers/AuthProvider';

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onSearchSubmit?: (query: string) => void;
  onLoginClick?: () => void;
}

export default function Header({ cartItemCount = 0, onCartClick, onSearchSubmit, onLoginClick }: HeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search submitted:', searchQuery);
    onSearchSubmit?.(searchQuery);
    setShowSearch(false);
  };

  const navItems = ['WOMEN', 'MEN', 'KIDS', 'SALE'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-transparent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-light text-black tracking-[0.2em] cursor-pointer hover:opacity-70 transition-opacity" data-testid="text-logo">
              NIRVI
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-12">
            {navItems.map((item) => (
              <button
                key={item}
                className="text-xs font-medium tracking-widest text-black hover:opacity-70 transition-opacity py-2 border-b-2 border-transparent hover:border-black"
                data-testid={`link-nav-${item.toLowerCase()}`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-4 pr-10 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-black focus:outline-none rounded-none"
                    data-testid="input-search"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full hover:bg-transparent"
                    onClick={() => setShowSearch(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex hover:bg-transparent"
                onClick={() => setShowSearch(true)}
                data-testid="button-search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden hover:bg-transparent"
              onClick={() => setShowSearch(!showSearch)}
              data-testid="button-search-mobile"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Admin Panel (only for admin users) */}
            {user?.role === 'admin' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/admin')}
                className="hover:bg-transparent"
                data-testid="button-admin"
                title="Admin Panel"
              >
                <Settings className="h-5 w-5" />
              </Button>
            )}

            {/* Login/Account */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (user) {
                  router.push(`/${user.id}`);
                } else {
                  onLoginClick?.();
                }
              }}
              className="hover:bg-transparent"
              data-testid="button-login"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative hover:bg-transparent"
              data-testid="button-cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]" data-testid="text-cart-count">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="sm:hidden border-t border-gray-200 py-4">
            <form onSubmit={handleSearchSubmit}>
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-black focus:outline-none rounded-none"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <nav className="py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item}
                  className="block w-full text-left px-4 py-2 text-sm font-medium tracking-widest text-black hover:opacity-70 transition-opacity"
                  data-testid={`link-nav-mobile-${item.toLowerCase()}`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}