"use client";

import React from "react";
import { motion } from 'framer-motion';
import { Instagram, Facebook, Menu, X, Linkedin } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const FooterSection = ({ title, items }: { title: string, items: { name: string, href: string }[] }) => {
    const isExpanded = expandedSection === title;

    return (
      <div className="border-b border-gray-800 py-2 md:border-none md:py-0">
        <div
          className="flex justify-between items-center cursor-pointer md:cursor-default mb-2 md:mb-4"
          onClick={() => toggleSection(title)}
        >
          <h4 className="text-white text-base md:text-lg font-semibold">{title}</h4>
          <button className="md:hidden text-gray-400">
            {isExpanded ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <div
  className={`flex flex-wrap gap-x-4 gap-y-2 text-sm md:text-base text-gray-400 overflow-hidden transition-all duration-300 ${
    isExpanded ? 'max-h-48 pb-2' : 'max-h-0 md:max-h-48'
  }`}
>
  {items.map((item, index) => (
    <a
      key={index}
      href={item.href}
      className="hover:text-white transition hover:underline py-1"
    >
      {item.name}
    </a>
  ))}
</div>

      </div>
    );
  };

  const socialLinks = [
    { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/company/nirvi", name: "LinkedIn" },
    { icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/nirvi", name: "Facebook" },
    { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/nirvi/", name: "Instagram" },
  ];

  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Column - Always visible */}
        <div className="">
        <div className="mb-8">
          <div className="mb-3">
            <Image
              src="/nirvi_logo.jpeg"
              alt="Nirvi"
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
            <span className="sr-only">Nirvi</span>
          </div>
          <p className="text-gray-400 text-sm md:text-base mb-4">
            Fashion as a force for change through sustainable development.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-gray-800 hover:bg-yellow-600 rounded-full p-2 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={item.name}
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Footer sections - Expandable on mobile */}
        <div className="grid md:grid-cols-3 gap-0 md:gap-8">


          <FooterSection
            title="Our Mission"
            items={[
              { name: "SDG 8 - Decent Work", href: "#sdg8" },
              { name: "SDG 12 - Responsible Consumption", href: "#sdg12" },
              { name: "SDG 13 - Climate Action", href: "#sdg13" },
              { name: "Contact Us", href: "/contact" }
            ]}
          />
          <FooterSection
            title="Impact"
            items={[
              { name: "Community Stories", href: "#testimonials" },
              { name: "Sustainability Report", href: "/sustainability" },
              { name: "Partnership Opportunities", href: "/partnerships" }
            ]}
          />
          <FooterSection
            title="Legal"
            items={[
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
              { name: "FAQ", href: "/help" }
            ]}
          />
        </div>
        </div>
        {/* Bottom note */}
        <div className="mt-8 pt-4 border-t border-gray-800 text-center text-xs md:text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Nirvi. All rights reserved. Supporting 6 UN Sustainable Development Goals.
        </div>
      </div>
    </footer>
  );
};

export default Footer;