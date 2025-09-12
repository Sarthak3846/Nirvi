"use client";

import React, { FC } from 'react';
import { motion } from 'framer-motion';

const FeaturesSection: FC = () => {
  return (
    <section
      id="features"
      className="relative py-16 sm:py-20 z-10 min-h-full overflow-hidden"
    >
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Our <span className="text-yellow-600">Sustainable</span> Development Goals
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Through upcycled fashion and social initiatives, we align with 6 key UN SDGs to create positive change.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: 'SDG 8 - Decent Work & Economic Growth',
              description:
                'Nirvi supports local tailors and craftspeople by ensuring fair wages and ethical working conditions through our growing product line.',
              icon: (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-yellow-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-yellow-200 transition text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              ),
            },
            {
              title: 'SDG 13 - Climate Action',
              description:
                'By reducing textile waste and advocating for slow, circular fashion, we take direct steps toward mitigating environmental harm.',
              icon: (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-green-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-green-200 transition text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ),
            },
            {
              title: 'SDG 12 - Responsible Consumption',
              description:
                'Each of our products is made from discarded materials like denim, wool, and shoes — proving waste can be turned into beauty and utility.',
              icon: (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-amber-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-amber-200 transition text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              ),
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="bg-white p-6 sm:p-8 rounded-xl border border-yellow-100 hover:border-yellow-300 transition-all duration-300 group hover:shadow-lg hover:shadow-yellow-100 hover:translate-y-[-5px]"
            >
              {feature.icon}
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 group-hover:text-yellow-700 transition-colors">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;


