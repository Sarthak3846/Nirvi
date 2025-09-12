"use client"


import { AnimatePresence, motion } from "framer-motion"

import { X, Upload } from "lucide-react" // 🚀 Added X and Upload icons

// 🚀 Added custom alert component
const ResumeRequiredAlert = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            <div className="relative">
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full border border-purple-500/30 bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-white"
                    onClick={onClose}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">Resume Required</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Please upload a resume file before continuing. We need your resume to tailor it to the job requirements.
                  </p>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                  >
                    Got it
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResumeRequiredAlert;