"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolledDown, setScrolledDown] = useState<boolean>(false);

  // Handle scroll for animated navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolledDown(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div>
      <nav
        className={`border-b border-yellow-100/70 backdrop-blur-lg z-[100] fixed top-0 w-full transition-all duration-300 ${
          scrolledDown ? 'bg-white/95 shadow-sm' : 'bg-white/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center">
            <div className="flex items-center p-2">
              <Link href="/" className="flex items-center">
                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                  <span className="text-2xl font-extrabold tracking-tight text-gray-900">Nirvi</span>
                </motion.div>
              </Link>
            </div>

            {/* Desktop Navigation (center) */}
            <div className="hidden md:flex items-center justify-center">
              <nav className="flex items-center gap-10">
                <Link href="/#features" className="text-gray-700 hover:text-gray-900 hover:underline underline-offset-4 decoration-gray-300 transition-colors">
                  SDGs
                </Link>
                <Link href="/#how-it-works" className="text-gray-700 hover:text-gray-900 hover:underline underline-offset-4 decoration-gray-300 transition-colors">
                  Mission
                </Link>
                <Link href="/#testimonials" className="text-gray-700 hover:text-gray-900 hover:underline underline-offset-4 decoration-gray-300 transition-colors">
                  Impact
                </Link>
                <Link href="/#contact" className="text-gray-700 hover:text-gray-900 hover:underline underline-offset-4 decoration-gray-300 transition-colors">
                  Contact
                </Link>
              </nav>
            </div>

            {/* Desktop CTA (right) */}
            <div className="hidden md:flex justify-end items-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm transition-colors"
                >
                  Login / Signup
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden relative z-[100]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-lg border-t border-yellow-100">
                <Link
                  href="/#features"
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-yellow-50 transition-all duration-300 touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Our SDGs
                </Link>
                <Link
                  href="/#how-it-works"
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-yellow-50 transition-all duration-300 touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Our Mission
                </Link>
                <Link
                  href="/#testimonials"
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-yellow-50 transition-all duration-300 touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Impact
                </Link>
                <Link
                  href="/#contact"
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-yellow-50 transition-all duration-300 touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="px-3 py-2">
                  <Link
                    href="/login"
                    className="block w-full text-center bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-full text-white font-semibold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login / Signup
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile menu button */}
      <div className="md:hidden flex items-center fixed top-3 right-3 z-[110]">
        <motion.button
          onClick={toggleMobileMenu}
          className="text-gray-700 hover:text-gray-900 p-2 bg-white/80 rounded-md border border-yellow-100"
          aria-label="Toggle mobile menu"
          whileTap={{ scale: 0.9 }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>
    </div>
  );
};

export default Navigation;
