"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface NoDataFoundProps {
  dataTitle?: string;
  noDataText?: string;
  className?: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({ 
  dataTitle="Data", 
  noDataText="No Data Found", 
  className = "" 
}) => {
  const defaultText = `No ${dataTitle} found.`;
  const message = noDataText || defaultText;

  // Variants for sparkles blinking
  const sparkleVariants: Variants = {
    animate: {
      scale: [1, 1.25, 0.9, 1.25, 1],
      opacity: [0.6, 1, 0.4, 1, 0.6],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Variants for magnifying glass floating
  const searchGlassVariants: Variants = {
    animate: {
      y: [0, -4, 2, 0],
      x: [0, 3, -1, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col items-center justify-center p-12 text-center border border-gray-100 rounded-3xl bg-linear-to-b from-gray-50/70 to-white shadow-[0_8px_30px_rgb(0,0,0,0.015)] backdrop-blur-md relative overflow-hidden ${className}`}
    >
      {/* Decorative Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Modern Custom Premium SVG Illustration */}
      <div className="relative mb-6 flex justify-center items-center">
        <svg className="w-24 h-24 text-blue-500/80 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glowing backdrop circle */}
          <circle cx="50" cy="50" r="35" fill="url(#circleGrad)" opacity="0.1" />
          
          {/* Paper/Document sheet */}
          <motion.rect 
            x="32" 
            y="20" 
            width="36" 
            height="46" 
            rx="5" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="white"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Lines on paper */}
          <line x1="42" y1="32" x2="58" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          <line x1="42" y1="40" x2="58" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          <line x1="42" y1="48" x2="50" y2="48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          
          {/* A floating magnifying glass searching the empty paper */}
          <motion.g
            variants={searchGlassVariants}
            animate="animate"
          >
            <circle cx="66" cy="62" r="11" fill="white" stroke="#6366f1" strokeWidth="2.5" />
            <line x1="74" y1="70" x2="84" y2="80" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            {/* Red/Indigo X Cross inside glass to indicate "Not Found" */}
            <line x1="62" y1="58" x2="70" y2="66" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="70" y1="58" x2="62" y2="66" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" />
          </motion.g>

          {/* Floating Sparkles/Stars */}
          <motion.path 
            variants={sparkleVariants}
            animate="animate"
            d="M20 28L21.5 31L24.5 32.5L21.5 34L20 37L18.5 34L15.5 32.5L18.5 31L20 28Z" 
            fill="#3b82f6" 
          />
          <motion.path 
            variants={sparkleVariants}
            animate="animate"
            transition={{ delay: 0.5 }}
            d="M76 22L77.2 24.5L79.7 25.7L77.2 26.9L76 29.4L74.8 26.9L72.3 25.7L74.8 24.5L76 22Z" 
            fill="#818cf8" 
          />
          
          <defs>
            <linearGradient id="circleGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-2">
        {dataTitle === "Data" ? "No Results Found" : `${dataTitle.charAt(0).toUpperCase() + dataTitle.slice(1)} Empty`}
      </h3>
      
      <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-5">
        {message}
      </p>
      
      <div className="h-[2px] w-12 bg-linear-to-r from-blue-100 to-indigo-100 rounded-full" />
    </motion.div>
  );
};

export default NoDataFound;