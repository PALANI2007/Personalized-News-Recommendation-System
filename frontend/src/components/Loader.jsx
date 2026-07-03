import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({ message = "Loading data..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        <motion.span 
          className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span 
          className="absolute top-0 left-0 w-full h-full border-t-4 border-brandIndigo rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.span 
          className="absolute top-2 left-2 w-12 h-12 border-r-4 border-brandCyan rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <p className="text-slate-400 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
}
