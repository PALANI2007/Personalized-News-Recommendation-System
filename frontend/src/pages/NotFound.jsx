import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, BrainCircuit } from 'lucide-react';
import useSEO from '../utils/useSEO';

export default function NotFound() {
  const location = useLocation();
  useSEO('404 — Page Not Found | NeuralNews', 'The page you are looking for does not exist.');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative" aria-labelledby="notfound-title">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 radial-glow-indigo blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 radial-glow-purple blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg relative z-10 space-y-8"
      >
        {/* 404 Display */}
        <div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
            className="text-[120px] sm:text-[160px] font-black leading-none bg-gradient-to-r from-indigo-500/20 via-purple-500/30 to-indigo-500/20 bg-clip-text text-transparent select-none"
            aria-hidden="true"
          >
            404
          </motion.div>
          <div className="flex items-center justify-center gap-2 -mt-4 mb-4">
            <BrainCircuit className="w-5 h-5 text-indigo-400" aria-hidden="true" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Page Not Found</span>
          </div>
        </div>

        <div>
          <h1 id="notfound-title" className="text-2xl font-extrabold text-slate-100 mb-3">
            This route doesn't exist
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            The path <code className="px-1.5 py-0.5 bg-white/5 rounded text-indigo-300 text-xs font-mono">{location.pathname}</code> doesn't exist in the application. Try navigating to one of the pages below.
          </p>
        </div>

        {/* Quick nav links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13]">
            <Home className="w-4 h-4" aria-hidden="true" /> Go Home
          </Link>
          <Link to="/search" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-panel text-slate-300 text-sm font-bold hover:text-white hover:bg-white/10 border border-white/10 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13]">
            <Search className="w-4 h-4" aria-hidden="true" /> Search News
          </Link>
        </div>

        <Link to={-1} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Go back to previous page
        </Link>
      </motion.div>
    </div>
  );
}
