"use client";

import React, { FC } from 'react';
import { motion } from 'framer-motion';

const ContactSection: FC = () => {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-gradient-to-b from-white via-yellow-50/20 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Get in touch</h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            We’d love to hear from you. Reach out for partnerships, press, or general inquiries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8">
          {/* Contact cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="md:col-span-2 bg-white border border-yellow-100 rounded-2xl p-6 sm:p-7 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact details</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">@</span>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href="mailto:hello@nirvi.brand" className="font-medium hover:underline">hello@nirvi.brand</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">☎</span>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a href="tel:+1-415-555-0199" className="font-medium hover:underline">+1 (415) 555‑0199</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">⌂</span>
                <div>
                  <p className="text-sm text-gray-500">Studio</p>
                  <p className="font-medium">Nirvi Studio, 210 Market Street, San Francisco, CA</p>
                </div>
              </li>
            </ul>
            <div className="mt-6 text-sm text-gray-500">
              Available Mon–Fri, 9:00–18:00 (PST)
            </div>
          </motion.div>

          {/* Simple contact form (non-functional placeholder) */}
          <motion.form
            onSubmit={(e) => e.preventDefault()}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3 bg-white border border-yellow-100 rounded-2xl p-6 sm:p-7 shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input type="text" placeholder="Jane" className="w-full rounded-lg border-gray-200 focus:border-amber-400 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input type="text" placeholder="Doe" className="w-full rounded-lg border-gray-200 focus:border-amber-400 focus:ring-amber-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="jane@company.com" className="w-full rounded-lg border-gray-200 focus:border-amber-400 focus:ring-amber-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={4} placeholder="Tell us a little about your inquiry..." className="w-full rounded-lg border-gray-200 focus:border-amber-400 focus:ring-amber-400" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm transition-colors"
              >
                Send message
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;


