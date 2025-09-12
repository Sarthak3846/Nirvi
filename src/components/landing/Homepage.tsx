"use client";

import React, { useState, useEffect, useRef, FC, JSX } from 'react';
import { motion, useSpring, useScroll, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Howitwork from './Howitwork';
import Navigation from './Navigation';
import Link from 'next/link';
import Image from 'next/image';
import HeroSection from './sections/HeroSection';
import VideoSection from './sections/VideoSection';
import FeaturesSection from './sections/FeaturesSection';

interface TypeWriterProps {
  text: string;
  className?: string;
}

interface MobileNavProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
}

// Mobile Navigation Component
const MobileNav: FC<MobileNavProps> = ({ activeSection, onSectionClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'features', label: 'Our SDGs' },
    { id: 'testimonials', label: 'Impact' },
    { id: 'how-it-works', label: 'Our Mission' },
  ];

  const handleClick = (id: string) => {
    onSectionClick(id);
    setIsOpen(false);
  };


  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-yellow-500/90 backdrop-blur-sm rounded-lg border border-yellow-400"
        aria-label="Toggle navigation"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : '100%',
        }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-lg"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-yellow-100/80">
            <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-500">
                Nirvi
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col justify-center px-6">
            <nav className="space-y-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className={`block text-2xl font-medium cursor-pointer transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'text-yellow-600 transform translate-x-2' 
                      : 'text-gray-900 hover:text-yellow-600 hover:transform hover:translate-x-1'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </div>
          
          {/* Bottom CTA */}
          <div className="p-6 border-t border-yellow-100/80">
            <motion.button
              onClick={() => setIsOpen(false)}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl text-white font-semibold text-lg hover:shadow-xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get in Touch
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// keep TypeWriter type for potential external use

// Main HomePage component
const HomePage: FC = () => {
  const [activeSection] = useState<string>('hero');
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Refs for sections (not strictly needed now)
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);

  // Scroll tracking implementation
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToTop = () => {
    console.log("scrolling to top");
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  // Improved scrollToSection function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-amber-500 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Global centered background logo */}
      <div className="fixed inset-0 z-[1] pointer-events-none flex items-center justify-center">
        <Image
          src="/nirvi_logo.jpeg"
          alt="Nirvi background logo"
          width={800}
          height={800}
          className="opacity-10 object-contain w-[60vw] max-w-[800px]"
          priority
        />
      </div>

      {/* Noise texture overlay (subtle) */}
      <div className="fixed inset-0 z-[-2] opacity-10 pointer-events-none bg-repeat"></div>

      <div className="relative z-10">
      {/* Enhanced Navigation with Smooth Scroll */}
      <div className="hidden lg:block">
        <Navigation />
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      {/* Hero section */}
      <section ref={heroRef} id="hero">
        <HeroSection />
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Features section */}
      <section ref={featuresRef} id="features">
        <FeaturesSection />
      </section>

      <section ref={howItWorksRef} id="how-it-works">
        <Howitwork />
      </section>

      

      {/* Improved scroll-to-top button visibility and z-index */}
      <motion.button
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[1000] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 hover:shadow-xl transition-all duration-300 ${
          showScrollToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollToTop ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
      </div>
    </div>
  );
};

export default HomePage;
