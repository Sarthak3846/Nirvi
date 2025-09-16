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
            Built by <span className="text-yellow-600">Nirvi</span> — a Sustainable Brand
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            We design durable, upcycled products and invest in people. Our work advances a circular economy,
            supports fair livelihoods, and champions responsible consumption.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: 'Eco-friendly Materials',
              description:
                'Upcycled denim, wool, and recovered footwear components minimize waste and extend material lifecycles.',
              icon: (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-yellow-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-yellow-200 transition text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 2 3 5 3 5s3-3 3-5c0-1.657-1.343-3-3-3z" />
                  </svg>
                </div>
              ),
            },
            {
              title: 'Social Impact',
              description:
                'Ethical production with local tailors and women-led groups ensures fair wages and dignified work.',
              icon: (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-green-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-green-200 transition text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 0v7m0 0l-3-3m3 3l3-3" />
                  </svg>
                </div>
              ),
            },
            {
              title: 'Long-term Mission',
              description:
                'We build timeless, repairable pieces and a circular brand that grows with purpose and transparency.',
              icon: (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-amber-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-amber-200 transition text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m-4 4a8 8 0 110-16 8 8 0 010 16z" />
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


