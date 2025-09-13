"use client";

import React, { FC, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface TypeWriterProps {
  text: string;
  className?: string;
}

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
}

interface StatProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const TypeWriter: FC<TypeWriterProps> = ({ text, className }) => {
  const [displayText, setDisplayText] = useState('');
  const index = useRef(0);

  const gradientStart = text.indexOf('Through Sustainable Fashion');

  useEffect(() => {
    if (index.current < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayText(text.substring(0, index.current + 1));
        index.current += 1;
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [displayText, text]);

  const beforeGradient = displayText.substring(0, gradientStart);
  const gradientText = displayText.substring(gradientStart);

  return (
    <span className={className}>
      {beforeGradient}
      <span className="bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
        {gradientText}
      </span>
    </span>
  );
};

const FloatingElement: FC<FloatingElementProps> = ({ children, delay = 0, duration = 4, y = 15 }) => {
  return (
    <motion.div
      animate={{
        y: [0, -y, 0],
        transition: {
          duration,
          ease: 'easeInOut',
          times: [0, 0.5, 1],
          repeat: Infinity,
          delay,
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const ResumePreview: FC = () => {
  return (
    <div className="relative w-full max-w-xl h-84 sm:h-80 md:h-116 overflow-hidden shadow-2xl shadow-yellow-500/20 border-2 border-yellow-500/30 mx-auto rounded-2xl">
      <Image
        src="/homepage.jpeg"
        alt="Nirvi homepage preview"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
    </div>
  );
};

const HeroSection: FC = () => {
  const stats: StatProps[] = [
    { value: '6', label: 'SDGs Supported', icon: (<svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>) },
    { value: '100%', label: 'Upcycled Materials', icon: (<svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2H6a2 2 0 0 0-2 2v7h2V4h7V2zm5 5h-7a2 2 0 0 0-2 2v7H7V9a4 4 0 0 1 4-4h7V7z"/></svg>) },
    { value: '0', label: 'Waste to Landfill', icon: (<svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17l-3.88-3.88L3.71 13.7 9 19l12-12-1.41-1.41z"/></svg>) },
    { value: '∞', label: 'Impact Potential', icon: (<svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8c-1.657 0-3.156.896-4 2.25C13.156 8.896 11.657 8 10 8a5 5 0 100 10c1.657 0 3.156-.896 4-2.25C14.844 17.104 16.343 18 18 18a5 5 0 100-10zM8 13a3 3 0 010-6 3 3 0 010 6zm10 4a3 3 0 010-6 3 3 0 010 6z"/></svg>) },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-full overflow-hidden z-10 mt-16"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 sm:space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900"
            >
              <div className="space-y-1">
                <TypeWriter
                  text="Fashion as a Force for Change"
                  className=""
                />
                <div className="flex items-center justify-start gap-2 sm:gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-500">
                    Through Sustainable Fashion
                  </span>
                </div>
              </div>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-base sm:text-lg text-gray-600 leading-relaxed"
            >
              At Nirvi, we believe fashion can be a force for change — and that belief drives everything we do. Through our upcycled, handcrafted products and socially conscious initiatives, we align with <span className="text-yellow-600 font-semibold">6 key Sustainable Development Goals</span> set by the United Nations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="grid grid-cols-2 gap-2 sm:gap-4 my-4 sm:my-6"
            >
              {stats.map((stat, index) => (
                <FloatingElement key={index} delay={index * 0.2} y={8} duration={3 + index}>
                  <div className="bg-white/70 backdrop-blur-sm p-2 sm:p-3 rounded-xl border border-yellow-100 hover:border-yellow-400/50 transition group shadow-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      {stat.icon}
                      <span className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</span>
                    </div>
                    <p className="text-gray-600 text-xs">{stat.label}</p>
                  </div>
                </FloatingElement>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/contact"
                className="relative overflow-hidden px-6 py-3 rounded-lg border border-yellow-300 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 flex items-center justify-center group"
              >
                <span className="relative z-10">Get in Touch</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </Link>
              <Link
                href="/#features"
                className="relative overflow-hidden px-6 py-3 rounded-lg border border-yellow-200 bg-white hover:bg-yellow-50 transition text-base font-medium flex items-center justify-center text-gray-900 group"
              >
                <span className="relative z-10">Our Mission</span>
                <div className="absolute inset-0 bg-yellow-50 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:block relative h-full flex items-center justify-center"
          >
            <ResumePreview />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.2 }}
        className="flex flex-col space-y-4 relative bottom-2 max-w-full md:max-w-5xl mx-auto px-4 mt-16"
      >
        <div className="text-sm sm:text-base text-gray-600 text-center font-medium tracking-wide">
          Supporting <span className="text-yellow-600 font-semibold">6 SDGs</span> through sustainable fashion
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800 transition-colors">Upcycling</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 hover:border-purple-300 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-sm font-medium text-purple-700 group-hover:text-purple-800 transition-colors">Handcrafting</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 hover:border-green-300 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 17l-4-4 4-4v3h3a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-3v1zm-2-3l-4 4V7l4 4z"/>
            </svg>
            <span className="text-sm font-medium text-green-700 group-hover:text-green-800 transition-colors">Social Impact</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.5 }}
            className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 border border-pink-200 hover:border-pink-300 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l.09.01c3.27.32 5.91 3.03 5.91 6.39 0 1.91-.84 3.62-2.17 4.8L12 17.64l-3.83-4.44A6.38 6.38 0 0 1 6 8.4c0-3.36 2.64-6.07 5.91-6.39L12 2zm0 5.5A1.5 1.5 0 1 0 12 10a1.5 1.5 0 0 0 0-3z"/>
            </svg>
            <span className="text-sm font-medium text-pink-700 group-hover:text-pink-800 transition-colors">Sustainability</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border border-amber-200 hover:border-amber-300 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span className="text-sm font-medium text-amber-700 group-hover:text-amber-800 transition-colors">Community</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;


