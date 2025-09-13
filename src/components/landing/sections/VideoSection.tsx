"use client";

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const YouTubePlayer: FC<{ videoId: string }> = ({ videoId }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&controls=0`;

  return (
    <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-500/20 border-2 border-yellow-500/30 relative">
      <AnimatePresence>
        {isPlaying ? (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <iframe
              className="w-full h-full"
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </motion.div>
        ) : (
          <motion.div
            key="thumbnail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full cursor-pointer group"
            onClick={() => setIsPlaying(true)}
          >
            <Image
              src={thumbnailUrl}
              alt="Video thumbnail"
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-20 h-20 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-10 h-10 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VideoSection: FC = () => {
  return (
    <section id="video-section" className="py-12 sm:py-20 bg-gradient-to-b from-white via-yellow-50/20 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8 sm:mb-12 z-100">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Our Sustainable <span className="text-amber-600">Impact</span></h2>
            <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600">
              Discover how Nirvi transforms discarded materials into beautiful, functional products while supporting sustainable development goals.
            </p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: '🔹 SDG 8 – Decent Work & Economic Growth',
                  description:
                    'Nirvi supports local tailors and craftspeople by ensuring fair wages and ethical working conditions through our growing product line.',
                },
                {
                  title: '🔹 SDG 13 - Climate Action',
                  description:
                    'By reducing textile waste and advocating for slow, circular fashion, we take direct steps toward mitigating environmental harm.',
                },
                {
                  title: '🔹 SDG 12 – Responsible Consumption & Production',
                  description:
                    'Each of our products is made from discarded materials like denim, wool, and shoes — proving waste can be turned into beauty and utility.',
                },
                {
                  title: '🔹 SDG 3 – Good Health & Well-Being',
                  description:
                    'By designing calming, sustainable fidget toys for individuals with ADHD, anxiety, and autism, we promote mental wellness in eco-friendly ways.',
                },
                {
                  title: '🔹 SDG 11 – Sustainable Cities & Communities',
                  description:
                    'We build awareness through community stalls and workshops, encouraging mindful consumption and responsible fashion within urban spaces.',
                },
                {
                  title: '🔹 SDG 5 – Gender Equality',
                  description:
                    'We collaborate with NGO-backed women artisans and provide them opportunities for economic independence and creative expression.',
                },
              ].map((sdg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-yellow-100 p-6 rounded-xl hover:border-yellow-300 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-100"
                >
                  <h3 className="text-lg font-bold mb-3 text-yellow-700">{sdg.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{sdg.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        {/* Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-3xl p-8 sm:p-12 border border-yellow-200">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
              Join the <span className="text-amber-600">Enactus Movement</span>
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Be part of creating sustainable solutions that transform communities and protect our planet
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <span>Learn More About Our Impact</span>
                <motion.svg
                  whileHover={{ x: 5 }}
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-amber-500 rounded-full text-amber-600 font-semibold text-lg hover:bg-amber-50 transition-all duration-300 cursor-pointer"
              >
                <span>Get Involved</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;


