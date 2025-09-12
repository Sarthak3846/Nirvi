"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
          scrolledDown
            ? 'bg-white/95 shadow-sm'
            : 'bg-white/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center p-2">
              <Link href="/" className="flex items-center">
                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                  <Image
                    src="/nirvi_logo.jpeg"
                    alt="Nirvi"
                    width={120}
                    height={32}
                    className="h-14 w-auto object-contain"
                    priority
                  />
                  <span className="sr-only">Nirvi</span>
                </motion.div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-12 ml-auto">
              <Link
                href="/#features"
                className="text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 relative group"
              >
                Our SDGs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/#how-it-works"
                className="text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 relative group"
              >
                Our Mission
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/#testimonials"
                className="text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 relative group"
              >
                Impact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div className="ml-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/contact"
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-2 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
                  >
                    Get in Touch
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <motion.button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-gray-900 p-2"
                aria-label="Toggle mobile menu"
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
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
                <div className="px-3 py-2">
                  <Link
                    href="/contact"
                    className="block w-full text-center bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-2 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

    </div>



 
  );
};

export default Navigation;
