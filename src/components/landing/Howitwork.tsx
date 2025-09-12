"use client";

import React from "react";
import { Upload, Briefcase, FileText, CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Howitwork: React.FC = () => {
  // Features data
  const features = [
    {
      title: "Zero Waste Production",
      description: "Every product is made from 100% upcycled materials, ensuring no textile waste reaches landfills.",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "yellow"
    },
    {
      title: "Fair Trade Practices",
      description: "We ensure ethical working conditions and fair wages for all artisans and craftspeople in our network.",
      icon: <Sparkles className="w-6 h-6" />,
      color: "amber"
    },
    {
      title: "SDG Alignment",
      description: "Our initiatives directly support 6 United Nations Sustainable Development Goals for global impact.",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "yellow"
    },
    {
      title: "Community Empowerment",
      description: "Through workshops and collaborations, we build awareness and skills in sustainable fashion practices.",
      icon: <FileText className="w-6 h-6" />,
      color: "amber"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section id="features" className="pt-2 pb-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-yellow-50/40 to-white z-0"></div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            x: ['25%', '30%', '25%', '20%', '25%'],
            y: ['25%', '20%', '25%', '30%', '25%'],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[400px] h-[400px] border border-yellow-300/30 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            x: ['75%', '80%', '75%', '70%', '75%'],
            y: ['75%', '80%', '75%', '70%', '75%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[300px] h-[300px] border border-amber-300/30 rounded-full"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200">
            Our Mission
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">How Nirvi <span className="text-amber-600">Creates Impact</span></h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Three core pillars of our sustainable fashion mission
          </p>
        </motion.div>

        {/* Steps with better visual indicators */}
        <div className="grid md:grid-cols-3 gap-8 relative mb-24">
          {/* Connection line */}
          <div className="hidden md:block absolute top-28 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300/50 via-amber-300/50 to-yellow-300/50 transform z-0"></div>

          {[
            {
              icon: <Upload className="w-8 h-8" />,
              title: "Source Discarded Materials",
              description: "We collect discarded materials like denim, wool, and shoes from various sources to prevent waste.",
              color: "yellow"
            },
            {
              icon: <Briefcase className="w-8 h-8" />,
              title: "Handcraft with Purpose",
              description: "Local artisans transform waste into beautiful, functional products while earning fair wages.",
              color: "amber"
            },
            {
              icon: <FileText className="w-8 h-8" />,
              title: "Create Sustainable Impact",
              description: "Each product supports 6 UN SDGs, promoting environmental and social responsibility.",
              color: "yellow"
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative z-10"
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className={`bg-white p-8 rounded-xl border border-yellow-100 hover:border-${step.color}-300 transition-all duration-300 shadow-sm hover:shadow-${step.color}-100 h-full`}
              >
                <div className="flex flex-col items-center text-center mb-5">
                  <div className={`w-16 h-16 rounded-full bg-${step.color}-100 flex items-center justify-center mb-6 text-${step.color}-600 relative group`}>
                    <span className="absolute w-full h-full rounded-full bg-white animate-ping opacity-20"></span>
                    {step.icon}
                    <div className="absolute -top-3 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-900 border border-yellow-200 font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600 text-center">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Features grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative bg-white p-6 rounded-xl border border-yellow-100 hover:border-${feature.color}-300 transition-all duration-300 hover:shadow-lg hover:shadow-${feature.color}-100 group`}
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 text-${feature.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-yellow-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Howitwork;